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
                
                // Check if walking-in entity has reached the screen
                if (entity.walkIn && entity.walkIn.active) {
                    const onScreen = entity.position.x >= 0 && entity.position.x <= 960 &&
                                    entity.position.y >= 0 && entity.position.y <= 640;
                    if (onScreen) {
                        entity.walkIn.active = false; // Enable normal collision/boundaries
                    }
                }
                
                // Remove projectiles that go off-screen
                if (entity.destroyOnHit) {
                    const screenWidth = 1024;   // 16 tiles * 64 pixels
                    const screenHeight = 704;   // 11 tiles * 64 pixels
                    
                    if (entity.position.x < -64 || entity.position.x > screenWidth ||
                        entity.position.y < -64 || entity.position.y > screenHeight) {
                        entity.removeFromWorld = true;
                    }
                }
                
                // Note: Screen edge handling now done by RoomTransitionSystem
            }
        }
    }
    
    collidesWithTilemap(game, entity, x, y) {
        // Skip collision check while walking in from off-screen
        if (entity.walkIn && entity.walkIn.active) {
            return false;
        }
        
        const level = game.currentLevel;
        const collider = entity.collider;
        
        // Calculate actual collision box position using collider offset
        const collisionX = x + collider.offsetX;
        const collisionY = y + collider.offsetY;
        
        // Check the 4 corners of the collision box
        const corners = [
            { x: collisionX, y: collisionY },                                    // Top-left
            { x: collisionX + collider.width, y: collisionY  },                   // Top-right
            { x: collisionX , y: collisionY + collider.height },                  // Bottom-left
            { x: collisionX + collider.width, y: collisionY + collider.height }  // Bottom-right
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
