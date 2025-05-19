export interface Point {
  x: number;
  z: number;
}

export interface Collectible {
  position: Point;
  collected: boolean;
  value: number;
}

export interface Obstacle {
  position: Point;
  radius: number;
  damage: number;
}

export interface Exit {
  position: Point;
}

export interface Level {
  layout: number[][];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  exit: Exit;
  timeLimit: number;
  allCollectiblesGathered: boolean;
  offset: {
    x: number;
    z: number;
  };
}

// 0 = empty space, 1 = wall
export const levels: Level[] = [
  // Level 1 - Simple introduction
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    collectibles: [
      { position: { x: 2, z: 2 }, collected: false, value: 50 },
      { position: { x: 6, z: 3 }, collected: false, value: 50 },
      { position: { x: 4, z: 6 }, collected: false, value: 50 }
    ],
    obstacles: [],
    exit: { position: { x: 8, z: 7 } },
    timeLimit: 120,
    allCollectiblesGathered: false,
    offset: { x: 5, z: 4 }
  },
  
  // Level 2 - Introduces obstacles
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    collectibles: [
      { position: { x: 2, z: 2 }, collected: false, value: 75 },
      { position: { x: 9, z: 2 }, collected: false, value: 75 },
      { position: { x: 5, z: 7 }, collected: false, value: 75 },
      { position: { x: 9, z: 9 }, collected: false, value: 100 }
    ],
    obstacles: [
      { position: { x: 3, z: 3 }, radius: 0.5, damage: 1 },
      { position: { x: 7, z: 7 }, radius: 0.5, damage: 1 }
    ],
    exit: { position: { x: 10, z: 9 } },
    timeLimit: 180,
    allCollectiblesGathered: false,
    offset: { x: 6, z: 5 }
  },
  
  // Level 3 - More complex layout
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    collectibles: [
      { position: { x: 2, z: 2 }, collected: false, value: 100 },
      { position: { x: 7, z: 2 }, collected: false, value: 100 },
      { position: { x: 13, z: 3 }, collected: false, value: 100 },
      { position: { x: 9, z: 7 }, collected: false, value: 150 },
      { position: { x: 3, z: 10 }, collected: false, value: 150 }
    ],
    obstacles: [
      { position: { x: 5, z: 5 }, radius: 0.5, damage: 1 },
      { position: { x: 10, z: 3 }, radius: 0.5, damage: 1 },
      { position: { x: 3, z: 7 }, radius: 0.5, damage: 1 },
      { position: { x: 11, z: 11 }, radius: 0.5, damage: 1 }
    ],
    exit: { position: { x: 13, z: 11 } },
    timeLimit: 240,
    allCollectiblesGathered: false,
    offset: { x: 7, z: 6 }
  },
  
  // Level 4 - More challenging maze
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    collectibles: [
      { position: { x: 2, z: 2 }, collected: false, value: 150 },
      { position: { x: 15, z: 2 }, collected: false, value: 150 },
      { position: { x: 8, z: 6 }, collected: false, value: 200 },
      { position: { x: 3, z: 11 }, collected: false, value: 150 },
      { position: { x: 10, z: 14 }, collected: false, value: 200 },
      { position: { x: 15, z: 14 }, collected: false, value: 250 }
    ],
    obstacles: [
      { position: { x: 5, z: 4 }, radius: 0.5, damage: 1 },
      { position: { x: 10, z: 4 }, radius: 0.5, damage: 1 },
      { position: { x: 3, z: 8 }, radius: 0.5, damage: 1 },
      { position: { x: 8, z: 8 }, radius: 0.5, damage: 1 },
      { position: { x: 13, z: 8 }, radius: 0.5, damage: 1 },
      { position: { x: 5, z: 14 }, radius: 0.5, damage: 1 }
    ],
    exit: { position: { x: 15, z: 8 } },
    timeLimit: 300,
    allCollectiblesGathered: false,
    offset: { x: 8.5, z: 8 }
  },
  
  // Level 5 - Final challenge
  {
    layout: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    collectibles: [
      { position: { x: 2, z: 2 }, collected: false, value: 200 },
      { position: { x: 18, z: 2 }, collected: false, value: 200 },
      { position: { x: 5, z: 6 }, collected: false, value: 250 },
      { position: { x: 15, z: 4 }, collected: false, value: 250 },
      { position: { x: 9, z: 10 }, collected: false, value: 300 },
      { position: { x: 3, z: 14 }, collected: false, value: 250 },
      { position: { x: 17, z: 14 }, collected: false, value: 250 },
      { position: { x: 10, z: 18 }, collected: false, value: 300 }
    ],
    obstacles: [
      { position: { x: 5, z: 4 }, radius: 0.5, damage: 1 },
      { position: { x: 15, z: 6 }, radius: 0.5, damage: 1 },
      { position: { x: 9, z: 7 }, radius: 0.5, damage: 1 },
      { position: { x: 3, z: 10 }, radius: 0.5, damage: 1 },
      { position: { x: 17, z: 10 }, radius: 0.5, damage: 1 },
      { position: { x: 7, z: 12 }, radius: 0.5, damage: 1 },
      { position: { x: 13, z: 15 }, radius: 0.5, damage: 1 },
      { position: { x: 5, z: 17 }, radius: 0.5, damage: 1 },
      { position: { x: 15, z: 17 }, radius: 0.5, damage: 1 }
    ],
    exit: { position: { x: 18, z: 18 } },
    timeLimit: 420,
    allCollectiblesGathered: false,
    offset: { x: 10, z: 10 }
  }
];
