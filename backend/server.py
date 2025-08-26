from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File, Form
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional
from pathlib import Path
from datetime import datetime
import os
import uuid
import hashlib
import secrets

# Paths & ENV
ROOT_DIR = Path(__file__).parent
UPLOADS_DIR = ROOT_DIR / "uploads" / "animations"
TMP_DIR = ROOT_DIR / "uploads" / "tmp"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
TMP_DIR.mkdir(parents=True, exist_ok=True)

load_dotenv(ROOT_DIR / '.env')

# Mongo
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# App & Router
app = FastAPI()
api_router = APIRouter(prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security (admin)
security = HTTPBasic()
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Unauthorized", headers={"WWW-Authenticate": "Basic"})
    return True

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class Animation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    filename: str
    url: str
    size: int
    tags: List[str] = []
    mime: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AnimationList(BaseModel):
    items: List[Animation]
    total: int

class StartUploadRequest(BaseModel):
    name: str
    filename: str
    size: int
    tags: List[str] = []
    mime: Optional[str] = None

class StartUploadResponse(BaseModel):
    uploadId: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**sc) for sc in status_checks]

# ===================== Animations Library (Chunked Upload + Listing) ===================== #

@api_router.post("/animations/uploads/start", response_model=StartUploadResponse)
async def start_animation_upload(payload: StartUploadRequest, _=Depends(verify_admin)):
    upload_id = str(uuid.uuid4())
    temp_path = TMP_DIR / f"{upload_id}.part"
    # create empty file
    with open(temp_path, 'wb') as f:
        pass
    rec = {
        "_id": upload_id,
        "name": payload.name,
        "filename": payload.filename,
        "size": payload.size,
        "tags": payload.tags,
        "mime": payload.mime,
        "temp_path": str(temp_path),
        "completed": False,
        "created_at": datetime.utcnow(),
    }
    await db.animation_uploads.insert_one(rec)
    return StartUploadResponse(uploadId=upload_id)

@api_router.post("/animations/uploads/{upload_id}")
async def upload_animation_chunk(upload_id: str, request: Request, _=Depends(verify_admin)):
    # append raw bytes to temp file
    doc = await db.animation_uploads.find_one({"_id": upload_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Upload session not found")
    temp_path = Path(doc["temp_path"])
    body = await request.body()
    if not body:
        raise HTTPException(status_code=400, detail="Empty chunk")
    with open(temp_path, 'ab') as f:
        f.write(body)
    return {"ok": True, "received": len(body)}

@api_router.post("/animations/uploads/{upload_id}/finish", response_model=Animation)
async def finish_animation_upload(upload_id: str, _=Depends(verify_admin)):
    doc = await db.animation_uploads.find_one({"_id": upload_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Upload session not found")
    if doc.get("completed"):
        raise HTTPException(status_code=400, detail="Already completed")

    temp_path = Path(doc["temp_path"])  # .part
    if not temp_path.exists():
        raise HTTPException(status_code=404, detail="Temp file missing")

    # Build final filename (unique)
    orig = doc["filename"]
    ext = ''.join(Path(orig).suffixes) or ".bin"
    final_name = f"{upload_id}{ext}"
    final_path = UPLOADS_DIR / final_name
    temp_path.rename(final_path)

    size = final_path.stat().st_size

    anim = Animation(
        name=doc["name"],
        filename=final_name,
        url=f"/media/animations/{final_name}",
        size=size,
        tags=doc.get("tags", []),
        mime=doc.get("mime"),
    )
    await db.animations.insert_one(anim.dict())
    await db.animation_uploads.update_one({"_id": upload_id}, {"$set": {"completed": True, "final_path": str(final_path)}})
    return anim

@api_router.get("/animations", response_model=AnimationList)
async def list_animations(search: Optional[str] = None, tags: Optional[str] = None, limit: int = 50, offset: int = 0):
    query = {}
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    if tags:
        query["tags"] = {"$all": [t.strip() for t in tags.split(',') if t.strip()]}
    total = await db.animations.count_documents(query)
    docs = await db.animations.find(query).skip(offset).limit(limit).sort("created_at", -1).to_list(length=limit)
    items = [Animation(**d) for d in docs]
    return AnimationList(items=items, total=total)

@api_router.delete("/animations/{anim_id}")
async def delete_animation(anim_id: str, _=Depends(verify_admin)):
    doc = await db.animations.find_one({"id": anim_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    # delete file
    path = UPLOADS_DIR / doc["filename"]
    try:
        if path.exists():
            path.unlink()
    except Exception:
        pass
    await db.animations.delete_one({"id": anim_id})
    return {"ok": True}

@api_router.get("/media/animations/{filename}")
async def serve_animation_file(filename: str):
    path = UPLOADS_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path)

# ============== Simple Admin UI (Basic Auth) ============== #

ADMIN_HTML = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Animations Admin</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; background:#0b141b; color:#e6f0ff; margin:0; }
    .wrap { max-width: 920px; margin: 0 auto; padding: 24px; }
    .card { background:#0f2741; border-radius:12px; padding:16px; margin-bottom:16px; }
    .row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
    input, button, select { padding:10px 12px; border-radius:8px; border:1px solid #274864; background:#0d253d; color:#e6f0ff; }
    button { background:#3aa0ff; border:none; cursor:pointer; }
    .drop { border:2px dashed #274864; padding:24px; text-align:center; border-radius:12px; }
    .progress { height:10px; background:#27384d; border-radius:6px; overflow:hidden; }
    .bar { height:100%; width:0%; background:#18d56b; }
    table { width:100%; border-collapse: collapse; }
    th, td { padding:8px; border-bottom:1px solid #274864; }
  </style>
</head>
<body>
  <div class="wrap">
    <h2>Animations Library Admin</h2>
    <div class="card">
      <div class="row">
        <input id="name" placeholder="Name (e.g. Rainbow Spiral)" style="flex:1" />
        <input id="tags" placeholder="Tags (comma separated)" style="flex:2"/>
        <select id="mime">
          <option value="image/gif">GIF</option>
          <option value="application/json">JSON (frames)</option>
        </select>
      </div>
      <div id="drop" class="drop" style="margin-top:12px;">Drop file here or click to choose</div>
      <input type="file" id="file" style="display:none" />
      <div class="progress" style="margin-top:12px;"><div id="bar" class="bar"></div></div>
      <div id="msg" style="margin-top:8px; opacity:0.8;"></div>
    </div>

    <div class="card">
      <h3>Library</h3>
      <table>
        <thead><tr><th>Name</th><th>Size</th><th>Tags</th><th>URL</th><th></th></tr></thead>
        <tbody id="list"></tbody>
      </table>
    </div>
  </div>
<script>
(async function(){
  // Basic Auth is handled by the browser after initial challenge; do not override Authorization header in fetch calls.
const creds = null;
  const drop = document.getElementById('drop');
  const fileInput = document.getElementById('file');
  const bar = document.getElementById('bar');
  const msg = document.getElementById('msg');
  const list = document.getElementById('list');

  function human(n){ if(n<1024) return n+' B'; if(n<1024*1024) return (n/1024).toFixed(1)+' KB'; return (n/1024/1024).toFixed(1)+' MB'; }

  async function refresh(){
    const res = await fetch('/api/animations');
    const data = await res.json();
    list.innerHTML = '';
    data.items.forEach(it=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${it.name}</td><td>${human(it.size)}</td><td>${(it.tags||[]).join(', ')}</td><td><a href="${it.url}" target="_blank">Open</a></td><td><button data-id="${it.id}">Delete</button></td>`;
      tr.querySelector('button').onclick = async()=>{
        if(confirm('Delete '+it.name+'?')){
          const r = await fetch('/api/animations/'+it.id, {method:'DELETE', headers:{'Authorization': creds}});
          if(r.ok) refresh();
        }
      };
      list.appendChild(tr);
    })
  }

  drop.onclick = ()=> fileInput.click();
  drop.ondragover = (e)=>{e.preventDefault(); drop.style.opacity=0.7};
  drop.ondragleave = ()=>{drop.style.opacity=1};
  drop.ondrop = (e)=>{e.preventDefault(); drop.style.opacity=1; if(e.dataTransfer.files[0]) startUpload(e.dataTransfer.files[0]); }
  fileInput.onchange = ()=>{ if(fileInput.files[0]) startUpload(fileInput.files[0]); };

  async function startUpload(file){
    const name = document.getElementById('name').value || file.name;
    const tags = document.getElementById('tags').value.split(',').map(s=>s.trim()).filter(Boolean);
    const mime = document.getElementById('mime').value || file.type;

    msg.textContent = 'Starting upload...';
    bar.style.width = '0%';

    const startRes = await fetch('/api/animations/uploads/start', {
      method:'POST',
      headers:{'Content-Type':'application/json', 'Authorization': creds},
      body: JSON.stringify({ name, filename: file.name, size: file.size, tags, mime })
    });
    if(!startRes.ok){ msg.textContent = 'Start failed'; return; }
    const { uploadId } = await startRes.json();

    const chunkSize = 1024*1024; // 1MB
    let sent = 0; let part = 0;
    while(sent < file.size){
      const chunk = file.slice(sent, Math.min(sent+chunkSize, file.size));
      const buf = await chunk.arrayBuffer();
      const res = await fetch('/api/animations/uploads/'+uploadId, { method:'POST', headers:{'Authorization': creds}, body: buf });
      if(!res.ok){ msg.textContent = 'Chunk failed'; return; }
      sent += buf.byteLength; part++;
      bar.style.width = Math.round(sent*100/file.size)+'%';
    }

    const finRes = await fetch('/api/animations/uploads/'+uploadId+'/finish', { method:'POST', headers:{'Authorization': creds} });
    if(!finRes.ok){ msg.textContent = 'Finalize failed'; return; }
    msg.textContent = 'Upload complete';
    refresh();
  }

  refresh();
})();
</script>
</body>
</html>
"""

@api_router.get("/admin/animations")
async def admin_page(_=Depends(verify_admin)):
    # The browser will send the Authorization header automatically when using Basic Auth.
    # Our inline JS expects the same header for the protected POST/DELETE; we precompute a placeholder token.
    import base64
    token = "Basic " + base64.b64encode(f"{ADMIN_USERNAME}:{ADMIN_PASSWORD}".encode()).decode()
    html = ADMIN_HTML.replace('NEED_BASIC_AUTH', token)
    return HTMLResponse(html)

# Mount router
app.include_router(api_router)

# Shutdown
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()