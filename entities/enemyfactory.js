// EnemyFactory - creates enemies with proper spawn effects
const ENEMY_FACTORY = {
    create(game, enemyGroup, room) {
        // Get spawn location based on spawn type
        let spawn = this.getSpawnLocation(enemyGroup, room);
        
        if (!spawn) {
            console.warn(`Could not find valid spawn location for ${enemyGroup.type}`);
            return null;
        }
        
        // Create the enemy based on type
        let enemy;
        switch(enemyGroup.type) {
            case 'octorok':
                enemy = createOctorok(game, spawn.x, spawn.y, enemyGroup.color, enemyGroup.speed);
                break;
            // Future enemy types:
            // case 'leever':
            //     enemy = createLeever(game, spawn.x, spawn.y, enemyGroup.color);
            //     break;
            // case 'tektite':
            //     enemy = createTektite(game, spawn.x, spawn.y, enemyGroup.color);
            //     break;
            default:
                console.warn(`Unknown enemy type: ${enemyGroup.type}`);
                return null;
        }
        
        // Apply spawn effect based on spawn type
        if (enemyGroup.spawn === 'poof') {
            enemy.spawnEffect = new SpawnEffect(0.4);
        } else if (enemyGroup.spawn === 'walkin') {
            enemy.walkIn = new WalkIn();
            enemy.velocity.dx = spawn.velocityX;
            enemy.velocity.dy = spawn.velocityY;
        }
        
        return enemy;
    },
    
    getSpawnLocation(enemyGroup, room) {
        if (enemyGroup.spawn === 'poof') {
            return this.getPoofSpawn(room);
        } else if (enemyGroup.spawn === 'walkin') {
            return this.getWalkInSpawn(room, enemyGroup.direction);
        }
        return null;
    },
    
    getPoofSpawn(room, spawnTileType = 2) {
        const validTiles = this.getValidSpawnTiles(room, spawnTileType);
        
        if (validTiles.length === 0) {
            console.warn('No valid spawn tiles found for poof spawn');
            return null;
        }
        
        const tile = validTiles[randomInt(validTiles.length)];
        return this.tileToWorld(tile.x, tile.y);
    },
    
    getWalkInSpawn(room, direction, spawnTileType = 2) {
        const validEdgeTiles = this.getValidEdgeTiles(room, direction, spawnTileType);
        
        if (validEdgeTiles.length === 0) {
            console.warn(`No valid edge tiles found for walkin spawn from ${direction}`);
            return null;
        }
        
        const tile = validEdgeTiles[randomInt(validEdgeTiles.length)];
        const tilePos = this.tileToWorld(tile.x, tile.y);
        
        const walkSpeed = 80;
        switch(direction) {
            case 'west':
                return { x: -64, y: tilePos.y, velocityX: walkSpeed, velocityY: 0 };
            case 'east':
                return { x: 1024, y: tilePos.y, velocityX: -walkSpeed, velocityY: 0 };
            case 'north':
                return { x: tilePos.x, y: -64, velocityX: 0, velocityY: walkSpeed };
            case 'south':
                return { x: tilePos.x, y: 704, velocityX: 0, velocityY: -walkSpeed };
        }
    },
    
    getValidSpawnTiles(room, tileType = 2) {
        const tiles = room.tiles;
        const validTiles = [];
        
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                if (tiles[y][x] === tileType) {
                    validTiles.push({ x, y });
                }
            }
        }
        
        return validTiles;
    },
    
    getValidEdgeTiles(room, direction, tileType = 2) {
        const tiles = room.tiles;
        const validTiles = [];
        
        switch(direction) {
            case 'west':
                // Check leftmost column (x = 0)
                for (let y = 0; y < tiles.length; y++) {
                    if (tiles[y][0] === tileType) {
                        validTiles.push({ x: 0, y });
                    }
                }
                break;
                
            case 'east':
                // Check rightmost column
                const rightCol = tiles[0].length - 1;
                for (let y = 0; y < tiles.length; y++) {
                    if (tiles[y][rightCol] === tileType) {
                        validTiles.push({ x: rightCol, y });
                    }
                }
                break;
                
            case 'north':
                // Check top row (y = 0)
                for (let x = 0; x < tiles[0].length; x++) {
                    if (tiles[0][x] === tileType) {
                        validTiles.push({ x, y: 0 });
                    }
                }
                break;
                
            case 'south':
                // Check bottom row
                const bottomRow = tiles.length - 1;
                for (let x = 0; x < tiles[0].length; x++) {
                    if (tiles[bottomRow][x] === tileType) {
                        validTiles.push({ x, y: bottomRow });
                    }
                }
                break;
        }
        
        return validTiles;
    },
    
    tileToWorld(tileX, tileY) {
        return {
            x: tileX * 64,  // Center of tile
            y: tileY * 64
        };
    }
};
