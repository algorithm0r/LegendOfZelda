// EnemyFactory - creates enemies with proper spawn strategies and effects
const ENEMY_FACTORY = {
    create(game, enemyGroup, room) {
        // Determine spawn strategy based on enemy type (or walkin override)
        let spawnStrategy = this.getSpawnStrategy(enemyGroup);
        
        // Get spawn location based on strategy
        let spawn = this.getSpawnLocation(spawnStrategy, enemyGroup, room, game);
        
        if (!spawn) {
            console.warn(`Could not find valid spawn location for ${enemyGroup.type}`);
            return null;
        }
        
        // Create the enemy based on type
        let enemy = this.createEnemyByType(game, enemyGroup, spawn, room);
        
        if (!enemy) return null;
        
        // Apply spawn strategy mechanics (walkin velocity)
        if (spawnStrategy === 'edge' && spawn.velocityX !== undefined) {
            enemy.walkIn = new WalkIn();
            enemy.velocity.dx = spawn.velocityX;
            enemy.velocity.dy = spawn.velocityY;
        }
        
        // Apply spawn effects (poof animation) for certain enemies
        if (this.shouldHavePoofEffect(enemyGroup)) {
            enemy.spawnEffect = new SpawnEffect(0.4);
        }
        
        return enemy;
    },
    
    getSpawnStrategy(enemyGroup) {
        // Override: walkin flag forces edge spawn
        if (enemyGroup.walkin) {
            return 'edge';
        }
        
        // Auto-determine based on enemy type
        const gridSpawnTypes = ['octorok', 'moblin', 'lynel', 'zora', 'leever'];
        const freeSpawnTypes = ['peahat', 'tektite'];
        
        if (gridSpawnTypes.includes(enemyGroup.type)) {
            return 'grid';
        } else if (freeSpawnTypes.includes(enemyGroup.type)) {
            return 'free';
        }
        
        return 'grid'; // Default
    },
    
    shouldHavePoofEffect(enemyGroup) {
        // Poof effect for these enemies (not for zora/leever which emerge)
        const poofTypes = ['octorok', 'moblin', 'lynel', 'tektite', 'peahat'];
        
        // No poof for walkin spawns
        if (enemyGroup.walkin) return false;
        
        return poofTypes.includes(enemyGroup.type);
    },
    
    createEnemyByType(game, enemyGroup, spawn, room) {
        switch(enemyGroup.type) {
            case 'octorok':
                return createOctorok(game, spawn.x, spawn.y, enemyGroup.color, enemyGroup.speed);
            case 'moblin':
                return createMoblin(game, spawn.x, spawn.y, enemyGroup.color, enemyGroup.speed);
            case 'lynel':
                return createLynel(game, spawn.x, spawn.y, enemyGroup.color, enemyGroup.speed);
            case 'tektite':
                return createTektite(game, spawn.x, spawn.y, enemyGroup.color);
            case 'peahat':
                return createPeahat(game, spawn.x, spawn.y);
            case 'zora':
                // Zora needs valid water tiles for relocation
                const waterTiles = this.getValidSpawnTiles(room, this.getSpawnTileTypes('zora'), game);
                return createZora(game, spawn.x, spawn.y, enemyGroup.color, waterTiles);
            case 'leever':
                // Leever needs valid ground tiles for relocation
                const groundTiles = this.getValidSpawnTiles(room, this.getSpawnTileTypes('leever'), game);
                return createLeever(game, spawn.x, spawn.y, enemyGroup.color, groundTiles);
            default:
                console.warn(`Unknown enemy type: ${enemyGroup.type}`);
                return null;
        }
    },
    
    getSpawnLocation(strategy, enemyGroup, room, game) {
        switch(strategy) {
            case 'grid':
                return this.getGridSpawn(room, game, enemyGroup.type);
            case 'free':
                return this.getFreeSpawn(game);
            case 'edge':
                return this.getEdgeSpawn(room, enemyGroup.direction);
            default:
                return null;
        }
    },
    
    getSpawnTileTypes(enemyType) {
        // Return appropriate tile types for each enemy
        switch(enemyType) {
            case 'zora':
                return [91, 97]; // Water tiles
            case 'leever':
                return [2, 58];  // Ground tiles
            default:
                return [2, 58];  // Default: walkable ground
        }
    },
    
    getGridSpawn(room, game, enemyType) {
        const tileTypes = this.getSpawnTileTypes(enemyType);
        const validTiles = this.getValidSpawnTiles(room, tileTypes, game);
        
        if (validTiles.length === 0) {
            console.warn('No valid spawn tiles found for grid spawn');
            return null;
        }
        
        const tile = validTiles[Math.floor(Math.random() * validTiles.length)];
        return this.tileToWorld(tile.x, tile.y);
    },
    
    getFreeSpawn(game) {
        // Random point with 1-tile edge buffer (64px from edges)
        const edgeBuffer = 64;
        const minX = edgeBuffer;
        const maxX = 960; // 1024 - 64
        const minY = edgeBuffer;
        const maxY = 640; // 704 - 64
        
        // Try up to 50 times to find spawn not near Link
        for (let attempts = 0; attempts < 50; attempts++) {
            const x = minX + Math.random() * (maxX - minX);
            const y = minY + Math.random() * (maxY - minY);
            
            if (this.isPositionAwayFromLink(x, y, game)) {
                return { x, y };
            }
        }
        
        // Fallback: just spawn somewhere (shouldn't happen often)
        return {
            x: minX + Math.random() * (maxX - minX),
            y: minY + Math.random() * (maxY - minY)
        };
    },
    
    getEdgeSpawn(room, direction) {
        const validEdgeTiles = this.getValidEdgeTiles(room, direction, 2);
        
        if (validEdgeTiles.length === 0) {
            console.warn(`No valid edge tiles found for edge spawn from ${direction}`);
            return null;
        }
        
        const tile = validEdgeTiles[Math.floor(Math.random() * validEdgeTiles.length)];
        const tilePos = this.tileToWorld(tile.x, tile.y);
        
        const walkSpeed = 100;
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
    
    getValidSpawnTiles(room, tileTypes = [2], game = null) {
        const tiles = room.tiles;
        const validTiles = [];
        
        // 1-tile edge buffer
        const minX = 1;
        const maxX = tiles[0].length - 2;
        const minY = 1;
        const maxY = tiles.length - 2;
        
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                if (tileTypes.includes(tiles[y][x])) {
                    // Check if away from Link
                    if (game && !this.isTileAwayFromLink(x, y, game)) {
                        continue; // Skip tiles near Link
                    }
                    validTiles.push({ x, y });
                }
            }
        }
        
        return validTiles;
    },
    
    isTileAwayFromLink(tileX, tileY, game) {
        // Find Link
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position) return true;
        
        // Convert Link's position to tile
        const linkTileX = Math.floor(player.position.x / 64);
        const linkTileY = Math.floor(player.position.y / 64);
        
        // Calculate distance in tiles
        const dx = Math.abs(tileX - linkTileX);
        const dy = Math.abs(tileY - linkTileY);
        
        // Must be more than 2 tiles away (3+ tiles)
        return dx > 2 || dy > 2;
    },
    
    isPositionAwayFromLink(x, y, game) {
        // Find Link
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position) return true;
        
        // Calculate distance
        const dx = x - player.position.x;
        const dy = y - player.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Must be more than ~2.5 tiles away (160 pixels)
        return distance > 160;
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
            x: tileX * 64 + 32,  // Center of tile
            y: tileY * 64 + 32
        };
    }
};
