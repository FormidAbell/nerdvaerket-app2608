// Games bibliotek med forskellige spil som LOY PLAY
export interface GameItem {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  players: number;
  likes: number;
  plays: number;
  bestScore?: number;
  tags: string[];
  isNew?: boolean;
  isPopular?: boolean;
  controls: string[];
}

export const gameCategories = [
  { id: 'alle', name: 'Alle Spil', icon: 'game-controller' },
  { id: 'populaer', name: 'Populært', icon: 'star' },
  { id: 'nye', name: 'Nye', icon: 'sparkles' },
  { id: 'arcade', name: 'Arcade', icon: 'rocket' },
  { id: 'puzzle', name: 'Puzzle', icon: 'extension-puzzle' },
  { id: 'classic', name: 'Klassisk', icon: 'library' },
  { id: 'action', name: 'Action', icon: 'flash' },
] as const;

export const gamesLibrary: GameItem[] = [
  // KLASSISKE SPIL
  {
    id: 'g1',
    name: 'Snake',
    category: 'classic',
    description: 'Klassisk Snake spil. Spis æbler og voks uden at ramme dig selv!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Medium',
    players: 1,
    likes: 2456,
    plays: 12340,
    bestScore: 1250,
    tags: ['snake', 'klassisk', 'retro'],
    isPopular: true,
    controls: ['↑', '↓', '←', '→']
  },
  {
    id: 'g2',
    name: 'Tetris',
    category: 'classic',
    description: 'Faldende blokke! Arrangér dem for at lave rækker.',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Hard',
    players: 1,
    likes: 3421,
    plays: 18765,
    bestScore: 8900,
    tags: ['tetris', 'puzzle', 'blokke'],
    isPopular: true,
    controls: ['↑', '↓', '←', '→', 'A']
  },

  // NYE SPIL
  {
    id: 'g3',
    name: 'Space Shooter',
    category: 'nye',
    description: 'Skyd aliens i rummet! Undgå asteroider og saml power-ups.',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Medium',
    players: 1,
    likes: 567,
    plays: 2134,
    bestScore: 4560,
    tags: ['space', 'shooter', 'action'],
    isNew: true,
    controls: ['↑', '↓', '←', '→', 'SPACE']
  },
  {
    id: 'g4',
    name: 'Pixel Racer',
    category: 'nye',
    description: 'Kør så hurtigt som muligt! Undgå andre biler på vejen.',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Easy',
    players: 1,
    likes: 445,
    plays: 1876,
    bestScore: 2340,
    tags: ['racing', 'bil', 'hastighed'],
    isNew: true,
    controls: ['←', '→']
  },

  // ARCADE SPIL
  {
    id: 'g5',
    name: 'Pac-Man',
    category: 'arcade',
    description: 'Spis alle prikker og undgå spøgelserne!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Medium',
    players: 1,
    likes: 1876,
    plays: 9876,
    bestScore: 15680,
    tags: ['pacman', 'arcade', 'klassisk'],
    isPopular: true,
    controls: ['↑', '↓', '←', '→']
  },
  {
    id: 'g6',
    name: 'Breakout',
    category: 'arcade',
    description: 'Ødelæg alle mursten med bolden!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Medium',
    players: 1,
    likes: 1234,
    plays: 5432,
    bestScore: 7890,
    tags: ['breakout', 'arkade', 'bold'],
    controls: ['←', '→']
  },

  // PUZZLE SPIL
  {
    id: 'g7',
    name: '2048',
    category: 'puzzle',
    description: 'Kombiner numre for at nå 2048!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Hard',
    players: 1,
    likes: 987,
    plays: 4321,
    bestScore: 2048,
    tags: ['2048', 'puzzle', 'numre'],
    controls: ['↑', '↓', '←', '→']
  },
  {
    id: 'g8',
    name: 'Sudoku',
    category: 'puzzle',
    description: 'Løs det klassiske tal-puzzle!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Hard',
    players: 1,
    likes: 654,
    plays: 2109,
    bestScore: 780,
    tags: ['sudoku', 'logik', 'tal'],
    controls: ['1-9', 'SELECT']
  },

  // ACTION SPIL
  {
    id: 'g9',
    name: 'Frogger',
    category: 'action',
    description: 'Hjælp frøen med at krydse vejen og floden!',
    preview: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    difficulty: 'Medium',
    players: 1,
    likes: 1432,
    plays: 6789,
    bestScore: 3450,
    tags: ['frogger', 'action', 'frø'],
    controls: ['↑', '↓', '←', '→']
  }
];

export const getGamesByCategory = (categoryId: string) => {
  if (categoryId === 'alle') return gamesLibrary;
  if (categoryId === 'nye') return gamesLibrary.filter(game => game.isNew);
  if (categoryId === 'populaer') return gamesLibrary
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 6);
  return gamesLibrary.filter(game => game.category === categoryId);
};

export const getPopularGames = () => {
  return gamesLibrary
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 6);
};

export const getNewGames = () => {
  return gamesLibrary.filter(game => game.isNew);
};

export const searchGames = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return gamesLibrary.filter(game => 
    game.name.toLowerCase().includes(lowerQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    game.description.toLowerCase().includes(lowerQuery)
  );
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return '#4ecdc4'; // success
    case 'Medium': return '#ffe66d'; // warning  
    case 'Hard': return '#ff6b6b'; // accent
    default: return '#7a8ca0'; // muted
  }
};