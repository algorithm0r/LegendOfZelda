// MovementSystem - updates entity positions based on their velocities
class MovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.position && entity.velocity) {
                // Calculate new position
                const newX = entity.position.x + entity.velocity.dx * deltaTime;
                const newY = entity.position.y + entity.velocity.dy * deltaTime;
                
                // Check collision with tilemap using entity's collider
                if (game.currentLevel && entity.collider) {
                    if (!this.collidesWithTilemap(game, entity, newX, newY)) {
                        entity.position.x = newX;
                        entity.position.y = newY;
                    }
                } else {
                    // No level or no collider - move freely
                    entity.position.x = newX;
                    entity.position.y = newY;
                }
                
                // Note: Screen edge handling now done by RoomTransitionSystem
            }
        }
    }
    
    collidesWithTilemap(game, entity, x, y) {
        const level = game.currentLevel;
        const collider = entity.collider;
        
        // Calculate actual collision box position using collider offset
        const collisionX = x + collider.offsetX;
        const collisionY = y + collider.offsetY;
        
        // Check the 4 corners of the collision box
        const corners = [
            { x: collisionX + 8, y: collisionY + 8 },                                    // Top-left (with small margin)
            { x: collisionX + collider.width - 9, y: collisionY + 8 },                   // Top-right
            { x: collisionX + 8, y: collisionY + collider.height - 9 },                  // Bottom-left
            { x: collisionX + collider.width - 9, y: collisionY + collider.height - 9 }  // Bottom-right
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
            
            // Check if tile is passable (tile NOT in passableTiles list = solid)
            const tileIndex = level.tiles[tileY][tileX];
            if (!level.passableTiles.includes(tileIndex)) {
                return true; // Collided with solid tile
            }
        }
        
        return false; // No collision
    }
}
