// Media bibliotek REALISTISK for iDot-3 16x16 LED skærm
export interface MediaItem {
  id: string;
  name: string;
  category: string;
  preview: string;
  type: 'icon' | 'symbol' | 'pattern' | 'simple';
  likes: number;
  downloads: number;
  downloaded: boolean;
  fileSize?: string;
  dimensions: '16x16' | '8x8' | '4x4'; // Kun størrelser der passer på LED
  description?: string;
  tags: string[];
  realistic: boolean; // Kan faktisk vises på 16x16 LED
}

export const mediaCategories = [
  { id: 'ikoner', name: 'Ikoner', icon: 'shapes' },
  { id: 'symboler', name: 'Symboler', icon: 'star' },
  { id: 'emoji', name: 'Emoji', icon: 'happy' },
  { id: 'mønstre', name: 'Mønstre', icon: 'grid' },
] as const;

// REALISTISK media til 16x16 LED skærm
export const mediaLibrary: MediaItem[] = [
  // SIMPLE IKONER (kan vises på 16x16)
  {
    id: 'm1',
    name: 'Hjerte',
    category: 'ikoner',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'icon',
    likes: 1567,
    downloads: 2341,
    downloaded: true,
    fileSize: '256 bytes',
    dimensions: '16x16',
    tags: ['hjerte', 'kærlighed', 'symbol'],
    description: 'Simpel hjerte ikon',
    realistic: true
  },
  {
    id: 'm2',
    name: 'Smiley',
    category: 'emoji',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'icon',
    likes: 2145,
    downloads: 3421,
    downloaded: false,
    fileSize: '200 bytes',
    dimensions: '16x16',
    tags: ['smiley', 'glad', 'emoji'],
    description: 'Glad smiley ansigt',
    realistic: true
  },
  {
    id: 'm3',
    name: 'Stjerne',
    category: 'symboler',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'symbol',
    likes: 876,
    downloads: 1234,
    downloaded: false,
    fileSize: '180 bytes',
    dimensions: '16x16',
    tags: ['stjerne', 'rating', 'favorit'],
    description: '5-takket stjerne',
    realistic: true
  },

  // SIMPLE EMOJI (8x8 for klarhed)
  {
    id: 'm4',
    name: 'Thumbs Up',
    category: 'emoji',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'icon',
    likes: 567,
    downloads: 890,
    downloaded: true,
    fileSize: '120 bytes',
    dimensions: '8x8',
    tags: ['thumbs', 'ok', 'godkend'],
    description: 'Tommelfinger op',
    realistic: true
  },
  {
    id: 'm5',
    name: 'Kryds (X)',
    category: 'symboler',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'symbol',
    likes: 445,
    downloads: 678,
    downloaded: false,
    fileSize: '80 bytes',
    dimensions: '8x8',
    tags: ['kryds', 'nej', 'luk'],
    description: 'Simpel X symbol',
    realistic: true
  },
  {
    id: 'm6',
    name: 'Check Mark',
    category: 'symboler',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'symbol',
    likes: 789,
    downloads: 1123,
    downloaded: false,
    fileSize: '90 bytes',
    dimensions: '8x8',
    tags: ['check', 'ja', 'godkend'],
    description: 'Check mark symbol',
    realistic: true
  },

  // SIMPLE MØNSTRE
  {
    id: 'm7',
    name: 'Prikker',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 234,
    downloads: 456,
    downloaded: false,
    fileSize: '64 bytes',
    dimensions: '4x4',
    tags: ['prikker', 'dots', 'mønster'],
    description: '4 prikker i hjørner',
    realistic: true
  },
  {
    id: 'm8',
    name: 'Plus (+)',
    category: 'symboler',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'symbol',
    likes: 345,
    downloads: 567,
    downloaded: false,
    fileSize: '70 bytes',
    dimensions: '8x8',
    tags: ['plus', 'add', 'matematik'],
    description: 'Plus tegn',
    realistic: true
  },

  // PIX ART IKONER (små men synlige)
  {
    id: 'm9',
    name: 'Hus',
    category: 'ikoner',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'icon',
    likes: 456,
    downloads: 678,
    downloaded: false,
    fileSize: '150 bytes',
    dimensions: '16x16',
    tags: ['hus', 'hjem', 'bygning'],
    description: 'Simpel hus ikon',
    realistic: true
  },
  {
    id: 'm10',
    name: 'Pil Op',
    category: 'symboler',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'symbol',
    likes: 234,
    downloads: 345,
    downloaded: false,
    fileSize: '60 bytes',
    dimensions: '8x8',
    tags: ['pil', 'op', 'retning'],
    description: 'Pil der peger op',
    realistic: true
  }
];

export const getMediaByCategory = (categoryId: string) => {
  // Kun vis realistiske media
  const realisticMedia = mediaLibrary.filter(item => item.realistic);
  return realisticMedia.filter(item => item.category === categoryId);
};

export const searchMedia = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return mediaLibrary
    .filter(item => item.realistic)
    .filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      item.description?.toLowerCase().includes(lowerQuery)
    );
};

export const getFreeMedia = () => {
  return mediaLibrary.filter(item => item.realistic);
};