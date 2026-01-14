// RandomMovementSystem - controls entities with wandering AI behavior
class RandomMovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.randomMovement && entity.velocity && entity.facing && entity.position) {
                // Don't move while shooting or spawning!
                if (entity.shootingState && entity.shootingState.isShooting 
                    || entity.spawnEffect && entity.spawnEffect.spawning) {
                    entity.velocity.dx = 0;
                    entity.velocity.dy = 0;
                    continue;  // Skip rest of movement logic
                }
                
                // Update direction change timer
                entity.randomMovement.changeTimer += deltaTime;
                
                // Time to change direction?
                if (entity.randomMovement.changeTimer >= entity.randomMovement.changeInterval) {
                    this.changeDirection(entity, game);
                    entity.randomMovement.changeTimer = 0;
                }
            }
        }
    }
    
    changeDirection(entity, game) {
        if(entity.walkIn && entity.walkIn.spawning) {
            return; // Don't change direction while walking in
        }

        const directions = ['up', 'down', 'left', 'right'];
        const validDirections = [];
        
        // Test each direction to see if it's walkable
        for (let dir of directions) {
            if (this.canMoveInDirection(entity, dir, game)) {
                validDirections.push(dir);
            }
        }
        
        // Pick a random valid direction
        if (validDirections.length > 0) {
            const newDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            this.setDirection(entity, newDirection);
        } else {
            // No valid directions - stop moving (shouldn't happen if spawned properly)
            entity.velocity.dx = 0;
            entity.velocity.dy = 0;
        }
    }
    
    canMoveInDirection(entity, direction, game) {
        if (!game.currentLevel || !entity.collider) return true;
        
        // Test position slightly in that direction
        const testDistance = 16;  // Look ahead 16 pixels
        let testX = entity.position.x;
        let testY = entity.position.y;
        
        switch(direction) {
            case 'up': testY -= testDistance; break;
            case 'down': testY += testDistance; break;
            case 'left': testX -= testDistance; break;
            case 'right': testX += testDistance; break;
        }
        
        // Check if that position would collide with tilemap
        return !this.collidesWithTilemap(game, entity, testX, testY);
    }
    
    setDirection(entity, direction) {
        const speed = entity.randomMovement.speed;
        entity.facing.direction = direction;
        
        switch(direction) {
            case 'up':
                entity.velocity.dx = 0;
                entity.velocity.dy = -speed;
                break;
            case 'down':
                entity.velocity.dx = 0;
                entity.velocity.dy = speed;
                break;
            case 'left':
                entity.velocity.dx = -speed;
                entity.velocity.dy = 0;
                break;
            case 'right':
                entity.velocity.dx = speed;
                entity.velocity.dy = 0;
                break;
        }
    }
    
    // Collision detection (duplicated from MovementSystem - could refactor later)
    collidesWithTilemap(game, entity, x, y) {
        // Skip collision check while walking in from off-screen
        if (entity.walkIn && entity.walkIn.spawning) {
            return false;
        }
        
        const level = game.currentLevel;
        const collider = entity.collider;
        
        // Calculate actual collision box position using collider offset
        const collisionX = x + collider.offsetX;
        const collisionY = y + collider.offsetY;
        
        // Check the 4 corners of the collision box
        const corners = [
            { x: collisionX, y: collisionY },
            { x: collisionX + collider.width, y: collisionY },
            { x: collisionX, y: collisionY + collider.height },
            { x: collisionX + collider.width, y: collisionY + collider.height }
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
            
            // Check if tile is passable
            const tileIndex = level.tiles[tileY][tileX];
            if (!level.passableTiles.includes(tileIndex)) {
                return true; // Collided with solid tile
            }
        }
        
        return false; // No collision
    }
}
