#!/usr/bin/env python3
"""
NØJE BACKEND FEJLANALYSE - Comprehensive Backend Testing
Testing all critical points as requested in the review.
"""

import requests
import json
import base64
import os
import tempfile
from pathlib import Path
import time

# Configuration
BACKEND_URL = "https://ble-led-master.preview.emergentagent.com/api"
ADMIN_USERNAME = "nerdvaerket"
ADMIN_PASSWORD = "Ex1stftw"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth = (ADMIN_USERNAME, ADMIN_PASSWORD)
        self.results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            "test": test_name,
            "status": status,
            "message": message,
            "details": details or {}
        }
        self.results.append(result)
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
        print()
        
    def test_1_mongodb_connection(self):
        """1. Verificer MongoDB forbindelse og database tilgængelighed"""
        try:
            # Test basic endpoint that requires DB
            response = self.session.get(f"{BACKEND_URL}/status")
            if response.status_code == 200:
                self.log_result("MongoDB Connection", True, "Database connection working - status endpoint accessible")
            else:
                self.log_result("MongoDB Connection", False, f"Status endpoint failed: {response.status_code}", 
                              {"response": response.text})
        except Exception as e:
            self.log_result("MongoDB Connection", False, f"Connection error: {str(e)}")
            
    def test_2_backend_endpoints(self):
        """2. Test alle backend endpoints: /api/, /api/animations, /api/status"""
        endpoints = [
            ("/", "Root endpoint"),
            ("/status", "Status endpoint"),
            ("/animations", "Animations listing endpoint")
        ]
        
        for endpoint, description in endpoints:
            try:
                response = self.session.get(f"{BACKEND_URL}{endpoint}")
                if response.status_code == 200:
                    self.log_result(f"Endpoint {endpoint}", True, f"{description} accessible", 
                                  {"status_code": response.status_code})
                else:
                    self.log_result(f"Endpoint {endpoint}", False, f"{description} failed: {response.status_code}",
                                  {"response": response.text})
            except Exception as e:
                self.log_result(f"Endpoint {endpoint}", False, f"{description} error: {str(e)}")
                
    def test_3_cors_configuration(self):
        """3. Test CORS konfiguration for frontend integration"""
        try:
            # Test preflight request
            headers = {
                'Origin': 'https://ble-led-master.preview.emergentagent.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            response = self.session.options(f"{BACKEND_URL}/", headers=headers)
            
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            
            if cors_headers['Access-Control-Allow-Origin']:
                self.log_result("CORS Configuration", True, "CORS headers present", cors_headers)
            else:
                self.log_result("CORS Configuration", False, "CORS headers missing", cors_headers)
                
        except Exception as e:
            self.log_result("CORS Configuration", False, f"CORS test error: {str(e)}")
            
    def test_4_basic_auth_admin(self):
        """4. Verificer Basic Auth på admin interface: /api/admin/animations"""
        try:
            # Test without auth
            response = self.session.get(f"{BACKEND_URL}/admin/animations")
            if response.status_code == 401:
                self.log_result("Admin Auth - No Credentials", True, "Correctly requires authentication")
            else:
                self.log_result("Admin Auth - No Credentials", False, f"Should require auth but got: {response.status_code}")
                
            # Test with correct auth
            response = self.session.get(f"{BACKEND_URL}/admin/animations", auth=self.auth)
            if response.status_code == 200:
                self.log_result("Admin Auth - Valid Credentials", True, "Admin interface accessible with correct credentials")
            else:
                self.log_result("Admin Auth - Valid Credentials", False, f"Admin auth failed: {response.status_code}",
                              {"response": response.text})
                
            # Test with wrong auth
            wrong_auth = ("wrong", "credentials")
            response = self.session.get(f"{BACKEND_URL}/admin/animations", auth=wrong_auth)
            if response.status_code == 401:
                self.log_result("Admin Auth - Invalid Credentials", True, "Correctly rejects invalid credentials")
            else:
                self.log_result("Admin Auth - Invalid Credentials", False, f"Should reject invalid auth but got: {response.status_code}")
                
        except Exception as e:
            self.log_result("Admin Auth", False, f"Admin auth test error: {str(e)}")
            
    def test_5_animation_upload_listing_deletion(self):
        """5. Test animation upload, listing og sletning"""
        try:
            # Create a test file
            test_content = b"GIF89a\x01\x00\x01\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x04\x01\x00;"
            
            # Step 1: Start upload
            upload_data = {
                "name": "Test Animation",
                "filename": "test.gif",
                "size": len(test_content),
                "tags": ["test", "animation"],
                "mime": "image/gif"
            }
            
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/start", 
                                       json=upload_data, auth=self.auth)
            
            if response.status_code != 200:
                self.log_result("Animation Upload - Start", False, f"Start upload failed: {response.status_code}",
                              {"response": response.text})
                return
                
            upload_id = response.json()["uploadId"]
            self.log_result("Animation Upload - Start", True, f"Upload started with ID: {upload_id}")
            
            # Step 2: Upload chunk
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/{upload_id}",
                                       data=test_content, auth=self.auth,
                                       headers={"Content-Type": "application/octet-stream"})
            
            if response.status_code != 200:
                self.log_result("Animation Upload - Chunk", False, f"Chunk upload failed: {response.status_code}",
                              {"response": response.text})
                return
                
            self.log_result("Animation Upload - Chunk", True, "Chunk uploaded successfully")
            
            # Step 3: Finish upload
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/{upload_id}/finish", auth=self.auth)
            
            if response.status_code != 200:
                self.log_result("Animation Upload - Finish", False, f"Finish upload failed: {response.status_code}",
                              {"response": response.text})
                return
                
            animation_data = response.json()
            animation_id = animation_data["id"]
            self.log_result("Animation Upload - Finish", True, f"Upload completed, animation ID: {animation_id}")
            
            # Step 4: Test listing
            response = self.session.get(f"{BACKEND_URL}/animations")
            if response.status_code == 200:
                animations = response.json()
                found = any(anim["id"] == animation_id for anim in animations["items"])
                if found:
                    self.log_result("Animation Listing", True, "Uploaded animation found in listing")
                else:
                    self.log_result("Animation Listing", False, "Uploaded animation not found in listing")
            else:
                self.log_result("Animation Listing", False, f"Listing failed: {response.status_code}")
                
            # Step 5: Test deletion
            response = self.session.delete(f"{BACKEND_URL}/animations/{animation_id}", auth=self.auth)
            if response.status_code == 200:
                self.log_result("Animation Deletion", True, "Animation deleted successfully")
                
                # Verify deletion
                response = self.session.get(f"{BACKEND_URL}/animations")
                if response.status_code == 200:
                    animations = response.json()
                    found = any(anim["id"] == animation_id for anim in animations["items"])
                    if not found:
                        self.log_result("Animation Deletion - Verification", True, "Animation successfully removed from listing")
                    else:
                        self.log_result("Animation Deletion - Verification", False, "Animation still appears in listing after deletion")
            else:
                self.log_result("Animation Deletion", False, f"Deletion failed: {response.status_code}")
                
        except Exception as e:
            self.log_result("Animation Upload/Listing/Deletion", False, f"Error: {str(e)}")
            
    def test_6_json_response_format(self):
        """6. Verificer JSON response format matcher frontend expectations"""
        try:
            # Test animations listing format
            response = self.session.get(f"{BACKEND_URL}/animations")
            if response.status_code == 200:
                data = response.json()
                expected_fields = ["items", "total"]
                has_expected = all(field in data for field in expected_fields)
                
                if has_expected and isinstance(data["items"], list):
                    self.log_result("JSON Response Format - Animations", True, "Animations response format correct")
                    
                    # Check individual animation format if any exist
                    if data["items"]:
                        anim = data["items"][0]
                        anim_fields = ["id", "name", "filename", "url", "size", "created_at"]
                        has_anim_fields = all(field in anim for field in anim_fields)
                        if has_anim_fields:
                            self.log_result("JSON Response Format - Animation Item", True, "Animation item format correct")
                        else:
                            missing = [f for f in anim_fields if f not in anim]
                            self.log_result("JSON Response Format - Animation Item", False, f"Missing fields: {missing}")
                else:
                    self.log_result("JSON Response Format - Animations", False, "Animations response format incorrect", data)
            else:
                self.log_result("JSON Response Format - Animations", False, f"Failed to get animations: {response.status_code}")
                
            # Test status endpoint format
            response = self.session.get(f"{BACKEND_URL}/status")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("JSON Response Format - Status", True, "Status response format correct (list)")
                else:
                    self.log_result("JSON Response Format - Status", False, "Status response should be a list", data)
            else:
                self.log_result("JSON Response Format - Status", False, f"Failed to get status: {response.status_code}")
                
        except Exception as e:
            self.log_result("JSON Response Format", False, f"Error: {str(e)}")
            
    def test_7_error_handling(self):
        """7. Test error handling ved ugyldige requests"""
        try:
            # Test invalid animation ID
            response = self.session.delete(f"{BACKEND_URL}/animations/invalid-id", auth=self.auth)
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid Animation ID", True, "Correctly returns 404 for invalid animation ID")
            else:
                self.log_result("Error Handling - Invalid Animation ID", False, f"Expected 404, got: {response.status_code}")
                
            # Test invalid upload ID
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/invalid-id", 
                                       data=b"test", auth=self.auth)
            if response.status_code == 404:
                self.log_result("Error Handling - Invalid Upload ID", True, "Correctly returns 404 for invalid upload ID")
            else:
                self.log_result("Error Handling - Invalid Upload ID", False, f"Expected 404, got: {response.status_code}")
                
            # Test empty chunk upload
            upload_data = {
                "name": "Test",
                "filename": "test.gif",
                "size": 100,
                "tags": [],
                "mime": "image/gif"
            }
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/start", 
                                       json=upload_data, auth=self.auth)
            if response.status_code == 200:
                upload_id = response.json()["uploadId"]
                # Try empty chunk
                response = self.session.post(f"{BACKEND_URL}/animations/uploads/{upload_id}",
                                           data=b"", auth=self.auth)
                if response.status_code == 400:
                    self.log_result("Error Handling - Empty Chunk", True, "Correctly rejects empty chunks")
                else:
                    self.log_result("Error Handling - Empty Chunk", False, f"Expected 400 for empty chunk, got: {response.status_code}")
                    
        except Exception as e:
            self.log_result("Error Handling", False, f"Error: {str(e)}")
            
    def test_8_expo_backend_url(self):
        """8. Test at EXPO_BACKEND_URL https://ble-led-master.preview.emergentagent.com/api virker"""
        try:
            # This is the same as BACKEND_URL, so test basic connectivity
            response = self.session.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    self.log_result("EXPO_BACKEND_URL Connectivity", True, f"Backend URL accessible: {data['message']}")
                else:
                    self.log_result("EXPO_BACKEND_URL Connectivity", False, "Unexpected response format", data)
            else:
                self.log_result("EXPO_BACKEND_URL Connectivity", False, f"Backend URL not accessible: {response.status_code}")
                
        except Exception as e:
            self.log_result("EXPO_BACKEND_URL Connectivity", False, f"Error: {str(e)}")
            
    def test_9_frontend_api_calls(self):
        """9. Verificer at animations API kan kaldes fra frontend"""
        try:
            # Simulate frontend call with proper headers
            headers = {
                'Origin': 'https://ble-led-master.preview.emergentagent.com',
                'Content-Type': 'application/json'
            }
            
            response = self.session.get(f"{BACKEND_URL}/animations", headers=headers)
            if response.status_code == 200:
                # Check CORS headers in response
                cors_origin = response.headers.get('Access-Control-Allow-Origin')
                if cors_origin:
                    self.log_result("Frontend API Calls", True, "Animations API accessible from frontend with CORS")
                else:
                    self.log_result("Frontend API Calls", False, "Missing CORS headers in response")
            else:
                self.log_result("Frontend API Calls", False, f"Frontend API call failed: {response.status_code}")
                
        except Exception as e:
            self.log_result("Frontend API Calls", False, f"Error: {str(e)}")
            
    def test_10_server_file_uploads(self):
        """10. Tjek for fejl i server.py relateret til file uploads eller admin auth"""
        try:
            # Test the complete upload flow to check for any server errors
            test_content = b"Test file content for error checking"
            
            upload_data = {
                "name": "Error Test Animation",
                "filename": "error_test.bin",
                "size": len(test_content),
                "tags": ["error-test"],
                "mime": "application/octet-stream"
            }
            
            # Start upload
            response = self.session.post(f"{BACKEND_URL}/animations/uploads/start", 
                                       json=upload_data, auth=self.auth)
            
            if response.status_code == 200:
                upload_id = response.json()["uploadId"]
                
                # Upload chunk
                response = self.session.post(f"{BACKEND_URL}/animations/uploads/{upload_id}",
                                           data=test_content, auth=self.auth)
                
                if response.status_code == 200:
                    # Finish upload
                    response = self.session.post(f"{BACKEND_URL}/animations/uploads/{upload_id}/finish", 
                                               auth=self.auth)
                    
                    if response.status_code == 200:
                        animation_data = response.json()
                        self.log_result("Server File Upload Flow", True, "Complete upload flow works without server errors")
                        
                        # Clean up
                        self.session.delete(f"{BACKEND_URL}/animations/{animation_data['id']}", auth=self.auth)
                    else:
                        self.log_result("Server File Upload Flow", False, f"Finish upload failed: {response.status_code}",
                                      {"response": response.text})
                else:
                    self.log_result("Server File Upload Flow", False, f"Chunk upload failed: {response.status_code}",
                                  {"response": response.text})
            else:
                self.log_result("Server File Upload Flow", False, f"Start upload failed: {response.status_code}",
                              {"response": response.text})
                
        except Exception as e:
            self.log_result("Server File Upload Flow", False, f"Error: {str(e)}")
            
    def test_11_dependencies_check(self):
        """11. Verificer at alle dependencies i requirements.txt er korrekte"""
        try:
            # Test that all major dependencies are working by using their functionality
            
            # Test FastAPI (already tested through endpoints)
            # Test Motor (MongoDB async driver) - test through database operations
            status_data = {"client_name": "dependency_test"}
            response = self.session.post(f"{BACKEND_URL}/status", json=status_data)
            
            if response.status_code == 200:
                self.log_result("Dependencies - Motor/MongoDB", True, "Motor MongoDB driver working correctly")
            else:
                self.log_result("Dependencies - Motor/MongoDB", False, f"Motor/MongoDB issue: {response.status_code}")
                
            # Test that server is running (indicates all dependencies loaded)
            response = self.session.get(f"{BACKEND_URL}/")
            if response.status_code == 200:
                self.log_result("Dependencies - General", True, "All dependencies appear to be loading correctly")
            else:
                self.log_result("Dependencies - General", False, "Server not responding - possible dependency issues")
                
        except Exception as e:
            self.log_result("Dependencies Check", False, f"Error: {str(e)}")
            
    def run_all_tests(self):
        """Run all tests and generate report"""
        print("=" * 80)
        print("NØJE BACKEND FEJLANALYSE - Starting Comprehensive Backend Testing")
        print("=" * 80)
        print()
        
        # Run all tests
        self.test_1_mongodb_connection()
        self.test_2_backend_endpoints()
        self.test_3_cors_configuration()
        self.test_4_basic_auth_admin()
        self.test_5_animation_upload_listing_deletion()
        self.test_6_json_response_format()
        self.test_7_error_handling()
        self.test_8_expo_backend_url()
        self.test_9_frontend_api_calls()
        self.test_10_server_file_uploads()
        self.test_11_dependencies_check()
        
        # Generate summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for r in self.results if "✅ PASS" in r["status"])
        failed = sum(1 for r in self.results if "❌ FAIL" in r["status"])
        
        print(f"Total Tests: {len(self.results)}")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        print()
        
        if failed > 0:
            print("FAILED TESTS:")
            print("-" * 40)
            for result in self.results:
                if "❌ FAIL" in result["status"]:
                    print(f"❌ {result['test']}: {result['message']}")
                    if result["details"]:
                        print(f"   Details: {result['details']}")
            print()
            
        print("ALL TEST RESULTS:")
        print("-" * 40)
        for result in self.results:
            print(f"{result['status']}: {result['test']}")
            
        return passed, failed

if __name__ == "__main__":
    tester = BackendTester()
    passed, failed = tester.run_all_tests()
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Backend is working correctly.")
        exit(0)
    else:
        print(f"\n⚠️  {failed} TESTS FAILED! Backend has issues that need attention.")
        exit(1)