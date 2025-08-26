// Animations bibliotek med skærmstørrelse support for iDot enheder
import { ScreenSize } from '../ble/deviceDetection';

export interface AnimationItem {
  id: string;
  name: string;
  category: string;
  preview: string;
  type: 'pattern' | 'color' | 'scroll' | 'simple';
  likes: number;
  downloaded: boolean;
  frames?: Uint8Array[];
  description?: string;
  tags: string[];
  supportedSizes: ScreenSize[]; // Hvilke skærmstørrelser understøttes
  complexity: 'low' | 'medium' | 'high'; // Kompleksitetsgrad
  isNew?: boolean; // Om animationen er ny
  isTrending?: boolean; // Om animationen er trending
}

export const animationCategories = [
  { id: 'farver', name: 'Farver', icon: 'color-palette' },
  { id: 'mønstre', name: 'Mønstre', icon: 'grid-outline' },
  { id: 'tekst', name: 'Tekst', icon: 'text-outline' },
  { id: 'simple', name: 'Simple', icon: 'ellipse-outline' },
] as const;

// Animations tilpasset forskellige skærmstørrelser
export const animationsLibrary: AnimationItem[] = [
  // FARVE ANIMATIONER (alle størrelser)
  {
    id: '1',
    name: 'Regnbue Fade',
    category: 'farver',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'color',
    likes: 247,
    downloaded: false,
    tags: ['regnbue', 'fade', 'farver'],
    description: 'Blød regnbue fade over hele skærmen',
    supportedSizes: ['16x16', '32x32', '64x64'],
    complexity: 'low',
    isNew: true
  },
  {
    id: '2',
    name: 'Blå Puls',
    category: 'farver',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'color',
    likes: 189,
    downloaded: true,
    tags: ['blå', 'puls', 'rytme'],
    description: 'Blå farve der pulser op og ned',
    supportedSizes: ['16x16', '32x32', '64x64'],
    complexity: 'low'
  },

  // SIMPLE MØNSTRE (16x16+)
  {
    id: '3',
    name: 'Kant Glow',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 234,
    downloaded: false,
    tags: ['kant', 'ramme', 'glow'],
    description: 'Lysende kant rundt om skærmen',
    supportedSizes: ['16x16', '32x32', '64x64'],
    complexity: 'low',
    isTrending: true
  },
  {
    id: '4',
    name: 'Centrum Punkt',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 178,
    downloaded: false,
    tags: ['centrum', 'punkt', 'fokus'],
    description: 'Lysende punkt i midten der vokser',
    supportedSizes: ['16x16', '32x32', '64x64'],
    complexity: 'medium'
  },

  // DETALJEREDE MØNSTRE (kun 32x32+)
  {
    id: '5',
    name: 'Kompleks Spiral',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 345,
    downloaded: false,
    tags: ['spiral', 'kompleks', 'rotation'],
    description: 'Detaljeret spiral med flere lag',
    supportedSizes: ['32x32', '64x64'],
    complexity: 'high',
    isNew: true,
    isTrending: true
  },
  {
    id: '6',
    name: 'Mandala Mønster',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 456,
    downloaded: false,
    tags: ['mandala', 'symmetri', 'meditation'],
    description: 'Symmetrisk mandala mønster',
    supportedSizes: ['32x32', '64x64'],
    complexity: 'high'
  },

  // HD ANIMATIONER (kun 64x64)
  {
    id: '7',
    name: 'Particle System',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 567,
    downloaded: false,
    tags: ['partikler', 'fysik', 'hd'],
    description: 'Komplekst partikelsystem',
    supportedSizes: ['64x64'],
    complexity: 'high',
    isNew: true
  },
  {
    id: '8',
    name: 'Fluid Dynamics',
    category: 'mønstre',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'pattern',
    likes: 678,
    downloaded: false,
    tags: ['fluid', 'væske', 'dynamik'],
    description: 'Væske simulation i høj opløsning',
    supportedSizes: ['64x64'],
    complexity: 'high',
    isTrending: true
  },

  // TEKST (tilpasset størrelse)
  {
    id: '9',
    name: 'HI',
    category: 'tekst',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'scroll',
    likes: 445,
    downloaded: true,
    tags: ['hi', 'hilsen', 'kort'],
    description: 'Simpel "HI" tekst',
    supportedSizes: ['16x16', '32x32', '64x64'],
    complexity: 'low'
  },
  {
    id: '10',
    name: 'HELLO WORLD',
    category: 'tekst',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'scroll',
    likes: 234,
    downloaded: false,
    tags: ['hello', 'world', 'programmering'],
    description: 'Klassisk "Hello World" scrolling tekst',
    supportedSizes: ['32x32', '64x64'], // Kræver mere plads
    complexity: 'medium',
    isNew: true
  },
  {
    id: '11',
    name: 'Komplette Sætninger',
    category: 'tekst',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    type: 'scroll',
    likes: 156,
    downloaded: false,
    tags: ['sætning', 'lang', 'tekst'],
    description: 'Fulde sætninger med emoji og symboler',
    supportedSizes: ['64x64'], // Kun til store skærme
    complexity: 'high'
  }
];

// Filtrer animations baseret på skærmstørrelse
export const getAnimationsByCategory = (categoryId: string, screenSize?: ScreenSize) => {
  let animations = animationsLibrary;
  
  // Filtrer baseret på skærmstørrelse
  if (screenSize) {
    animations = animations.filter(item => 
      item.supportedSizes.includes(screenSize)
    );
  }
  
  return animations.filter(item => item.category === categoryId);
};

export const getAnimationsForDevice = (screenSize: ScreenSize) => {
  return animationsLibrary.filter(item => 
    item.supportedSizes.includes(screenSize)
  );
};

export const getPopularAnimations = (screenSize?: ScreenSize) => {
  let animations = animationsLibrary;
  
  if (screenSize) {
    animations = animations.filter(item => 
      item.supportedSizes.includes(screenSize)
    );
  }
  
  return animations
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
};

export const searchAnimations = (query: string, screenSize?: ScreenSize) => {
  const lowerQuery = query.toLowerCase();
  let animations = animationsLibrary;
  
  if (screenSize) {
    animations = animations.filter(item => 
      item.supportedSizes.includes(screenSize)
    );
  }
  
  return animations.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    item.description?.toLowerCase().includes(lowerQuery)
  );
};

// Get animations stats for device
export const getAnimationStats = (screenSize: ScreenSize) => {
  const compatible = getAnimationsForDevice(screenSize);
  const byComplexity = {
    low: compatible.filter(a => a.complexity === 'low').length,
    medium: compatible.filter(a => a.complexity === 'medium').length,
    high: compatible.filter(a => a.complexity === 'high').length,
  };
  
  return {
    total: compatible.length,
    byComplexity,
    screenSize
  };
};