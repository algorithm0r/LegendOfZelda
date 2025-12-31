// MovementSystem - updates entity positions based on their velocities
class MovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.position && entity.velocity) {
                // Calculate new position
                const newX = entity.position.x + entity.velocity.dx * deltaTime;
                const newY = entity.position.y + entity.velocity.dy * deltaTime;
                
                // Check collision with tilemap
                if (game.currentLevel && !this.collidesWithTilemap(game, newX, newY, 64, 64)) {
                    entity.position.x = newX;
                    entity.position.y = newY;
                } else if (!game.currentLevel) {
                    // No level loaded, just move freely
                    entity.position.x = newX;
                    entity.position.y = newY;
                }
                
                // Keep entity on screen (fallback bounds)
                entity.position.x = Math.max(0, Math.min(entity.position.x, game.ctx.canvas.width - 64));
                entity.position.y = Math.max(0, Math.min(entity.position.y, game.ctx.canvas.height - 64));
            }
        }
    }
    
    collidesWithTilemap(game, x, y, width, height) {
        const level = game.currentLevel;
        
        // Check the 4 corners of the entity's bounding box
        const corners = [
            { x: x + 8, y: y + 8 },                     // Top-left (with small margin)
            { x: x + width - 9, y: y + 8 },             // Top-right
            { x: x + 8, y: y + height - 9 },            // Bottom-left
            { x: x + width - 9, y: y + height - 9 }     // Bottom-right
        ];
        
        for (let corner of corners) {
            const tileX = Math.floor(corner.x / 64);
            const tileY = Math.floor(corner.y / 64);
            
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
