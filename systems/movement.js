// MovementSystem - updates entity positions based on their velocities
class MovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.position && entity.velocity) {
                // Calculate new position
                const newX = entity.position.x + entity.velocity.dx * deltaTime;
                const newY = entity.position.y + entity.velocity.dy * deltaTime;
                
                // Check collision with tilemap
                if (game.currentLevel && !this.collidesWithTilemap(game, entity, newX, newY)) {
                    entity.position.x = newX;
                    entity.position.y = newY;
                } else if (!game.currentLevel) {
                    // No level loaded, just move freely
                    entity.position.x = newX;
                    entity.position.y = newY;
                }
                
                // Keep entity on screen (fallback bounds)
                // Account for tilemap offset (4.5 tiles = 288 pixels)
                const tilemapOffsetY = 4.5 * 64;
                const playAreaTop = tilemapOffsetY;
                const playAreaBottom = tilemapOffsetY + (11 * 64);
                
                entity.position.x = Math.max(0, Math.min(entity.position.x, game.ctx.canvas.width - 64));
                entity.position.y = Math.max(playAreaTop, Math.min(entity.position.y, playAreaBottom - 64));
            }
        }
    }
    
    collidesWithTilemap(game, entity, newX, newY) {
        const level = game.currentLevel;
        
        // Get collision box (use Collider component if available, otherwise use sprite size)
        let collisionBox;
        if (entity.collider) {
            collisionBox = {
                x: newX + entity.collider.offsetX,
                y: newY + entity.collider.offsetY,
                width: entity.collider.width,
                height: entity.collider.height
            };
        } else {
            // Fallback to full sprite size
            collisionBox = {
                x: newX,
                y: newY,
                width: 64,
                height: 64
            };
        }
        
        // Tilemap is offset down by 4.5 tiles (288 pixels)
        const tilemapOffsetY = 4.5 * 64;
        
        // Check the 4 corners of the collision box
        const corners = [
            { x: collisionBox.x + 2, y: collisionBox.y + 2 },                                    // Top-left
            { x: collisionBox.x + collisionBox.width - 3, y: collisionBox.y + 2 },               // Top-right
            { x: collisionBox.x + 2, y: collisionBox.y + collisionBox.height - 3 },              // Bottom-left
            { x: collisionBox.x + collisionBox.width - 3, y: collisionBox.y + collisionBox.height - 3 }  // Bottom-right
        ];
        
        for (let corner of corners) {
            // Convert world position to tile position (accounting for tilemap offset)
            const tileX = Math.floor(corner.x / 64);
            const tileY = Math.floor((corner.y - tilemapOffsetY) / 64);
            
            // Out of bounds check
            if (tileX < 0 || tileY < 0 || 
                tileY >= level.tiles.length ||
                tileX >= level.tiles[0].length) {
                return true; // Treat out of bounds as solid
            }
            
            // Check if tile is solid
            const tileIndex = level.tiles[tileY][tileX];
            if (level.solidTiles.includes(tileIndex)) {
                return true; // Collided with solid tile
            }
        }
        
        return false; // No collision
    }
}
