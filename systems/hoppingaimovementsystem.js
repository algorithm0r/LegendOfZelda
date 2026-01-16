// HoppingAIMovementSystem - controls enemies that hop in arcs
class HoppingAIMovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.hoppingAIMovement && entity.position) {
                const hop = entity.hoppingAIMovement;
                
                // Don't process while spawning
                if ((entity.spawnEffect && entity.spawnEffect.spawning) ||
                    (entity.walkIn && entity.walkIn.spawning)) {
                    continue;
                }
                
                if (hop.state === 'landed') {
                    // Waiting to jump
                    hop.timer += deltaTime;
                    
                    if (hop.timer >= hop.pauseDuration) {
                        this.startJump(entity, game);
                        hop.timer = 0;
                    }
                } else if (hop.state === 'hopping') {
                    // Mid-jump
                    hop.timer += deltaTime;
                    hop.jumpProgress = Math.min(hop.timer / hop.jumpDuration, 1.0);
                    
                    // Update position along arc
                    this.updateJumpPosition(entity);
                    
                    // Landed?
                    if (hop.jumpProgress >= 1.0) {
                        hop.state = 'landed';
                        hop.timer = 0;
                        hop.jumpProgress = 0;
                        
                        // Snap to exact target position
                        entity.position.x = hop.targetX;
                        entity.position.y = hop.targetY;
                    }
                }
            }
        }
    }
    
    startJump(entity, game) {
        const hop = entity.hoppingAIMovement;
        
        // Record start position
        hop.startX = entity.position.x;
        hop.startY = entity.position.y;
        
        // Pick random target
        const target = this.pickJumpTarget(entity, game);
        hop.targetX = target.x;
        hop.targetY = target.y;
        
        // Start jumping
        hop.state = 'hopping';
        hop.jumpProgress = 0;
    }
    
    pickJumpTarget(entity, game) {
        // Convert current position to tile coordinates
        const currentTileX = Math.floor(entity.position.x / 64);
        const currentTileY = Math.floor(entity.position.y / 64);
        
        // Valid columns: [x-3, x-2, x+2, x+3] (skip adjacent tiles)
        const validCols = [
            currentTileX - 3,
            currentTileX - 2,
            currentTileX + 2,
            currentTileX + 3
        ];
        
        // Valid rows: [y-1, y, y+1]
        const validRows = [
            currentTileY - 1,
            currentTileY,
            currentTileY + 1
        ];
        
        // Build list of valid targets (that are on-screen)
        const targets = [];
        const screenWidthTiles = 16;  // 1024 / 64
        const screenHeightTiles = 11; // 704 / 64
        
        for (let col of validCols) {
            for (let row of validRows) {
                // Check if on screen
                if (col >= 0 && col < screenWidthTiles &&
                    row >= 0 && row < screenHeightTiles) {
                    targets.push({ tileX: col, tileY: row });
                }
            }
        }
        
        // If no valid targets (shouldn't happen), stay in place
        if (targets.length === 0) {
            return { x: entity.position.x, y: entity.position.y };
        }
        
        // Pick random target
        const target = targets[Math.floor(Math.random() * targets.length)];
        
        // Convert to world coordinates (center of tile)
        return {
            x: target.tileX * 64 + 32,
            y: target.tileY * 64 + 32
        };
    }
    
    updateJumpPosition(entity) {
        const hop = entity.hoppingAIMovement;
        const progress = hop.jumpProgress;
        
        // Linear interpolation for x and y
        const x = hop.startX + (hop.targetX - hop.startX) * progress;
        const y = hop.startY + (hop.targetY - hop.startY) * progress;
        
        // Parabolic arc (peaks at progress = 0.5)
        // Formula: 4 * h * t * (1 - t) where h = arcHeight, t = progress
        const arcOffset = 4 * hop.arcHeight * progress * (1 - progress);
        
        // Apply position (subtract arcOffset to go UP)
        entity.position.x = x;
        entity.position.y = y - arcOffset;
    }
}
