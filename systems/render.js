// RenderSystem - draws tilemap and all entities with position
class RenderSystem {
    update(deltaTime, game) {
        // Clear the canvas
        game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
        
        // Check if player is transitioning
        const player = game.entities.find(e => e.playercontrolled);
        const transitioning = player && player.transition;
        
        // Draw background tilemap(s)
        if (game.currentLevel) {
            if (transitioning) {
                this.drawTransition(game, player.transition);
            } else {
                // Normal rendering - translate down for UI space
                game.ctx.save();
                game.ctx.translate(0, 288);
                this.drawTilemap(game, game.currentLevel.tiles, 0, 0);
                game.ctx.restore();
            }
        }
        
        game.ctx.save();
        game.ctx.translate(0, 288);
        
        // Apply camera offset if transitioning
        if (transitioning) {
            game.ctx.translate(player.transition.cameraOffsetX, player.transition.cameraOffsetY);
        }
        
        // Check debug mode
        const debugModeCheckbox = document.getElementById('debugMode');
        const debugMode = debugModeCheckbox.checked;
        
        // Draw all entities on top
        for (let entity of game.entities) {
            if (entity.position) {
                // Check if entity should be visible (flicker if invincible)
                let shouldRender = true;
                if (entity.invincibility) {
                    const flickerCycle = Math.floor(entity.invincibility.elapsed / entity.invincibility.flickerInterval);
                    shouldRender = (flickerCycle % 2 === 0); // Visible on even cycles, invisible on odd
                }
                
                if (shouldRender && entity.sprite) {
                    // Calculate sprite offset for attacks facing up/left
                    let offsetX = 0;
                    let offsetY = 0;
                    
                    // Link's attack sprites need offset when facing up or left
                    if (entity.attackState && entity.attackState.isAttacking && entity.facing) {
                        if (entity.facing.direction === 'up') {
                            offsetY = -64;  // Shift sprite up by one tile
                        } else if (entity.facing.direction === 'left') {
                            offsetX = -64;  // Shift sprite left by one tile
                        }
                    }
                    
                    // Draw sprite with 4x scaling (16x16 -> 64x64)
                    game.ctx.drawImage(
                        entity.sprite.image,
                        entity.sprite.frameX,          // Source X in spritesheet
                        entity.sprite.frameY,          // Source Y in spritesheet
                        entity.sprite.frameWidth,      // Source width (16)
                        entity.sprite.frameHeight,     // Source height (16)
                        entity.position.x + offsetX,   // Destination X (with offset)
                        entity.position.y + offsetY,   // Destination Y (with offset)
                        entity.sprite.frameWidth * 4,  // Destination width (64)
                        entity.sprite.frameHeight * 4  // Destination height (64)
                    );
                } 
                
                // Debug: Draw collision boxes
                if (debugMode) {
                    // Draw collider (blue) - used for tilemap collision
                    if (entity.collider) {
                        game.ctx.strokeStyle = 'rgba(0, 100, 255, 0.7)';
                        game.ctx.lineWidth = 2;
                        game.ctx.strokeRect(
                            entity.position.x + entity.collider.offsetX,
                            entity.position.y + entity.collider.offsetY,
                            entity.collider.width,
                            entity.collider.height
                        );
                    }
                    
                    // Draw hurtbox (green) - receives damage
                    if (entity.hurtbox) {
                        game.ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
                        game.ctx.lineWidth = 2;
                        game.ctx.strokeRect(
                            entity.position.x + entity.hurtbox.offsetX,
                            entity.position.y + entity.hurtbox.offsetY,
                            entity.hurtbox.width,
                            entity.hurtbox.height
                        );
                    }
                    
                    // Draw hitbox (red) - deals damage
                    if (entity.hitbox) {
                        game.ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
                        game.ctx.lineWidth = 2;
                        game.ctx.strokeRect(
                            entity.position.x + entity.hitbox.offsetX,
                            entity.position.y + entity.hitbox.offsetY,
                            entity.hitbox.width,
                            entity.hitbox.height
                        );
                    }
                }
                
                // Text and pickup animations should also flicker
                if (shouldRender) {
                    if (entity.text) {
                        // Draw text above entity
                        game.ctx.fillStyle = 'white';
                        
                        for (let i = 0; i < entity.text.content.length; i++) {
                            game.ctx.fillText(entity.text.content[i], 
                                192, 
                                entity.position.y - 96 + (i * 32));
                        }
                    }
                    if (entity.pickupAnimation) {
                        // Draw pickup animation above entity
                        const anim = entity.pickupAnimation;
                        game.ctx.drawImage(
                            ASSET_MANAGER.getAsset('./sprites/items.png'),
                            anim.sprite.frameX, anim.sprite.frameY, 16, 16,  // Source from collectible
                            entity.position.x - 24, entity.position.y - 64, 64, 64          // Destination
                        );
                    }
                }
            }
        }
        game.ctx.restore();
    }
    
    drawTransition(game, transition) {
        const tileImage = ASSET_MANAGER.getAsset('./sprites/tileset.png');
        
        game.ctx.save();
        
        // Restrict drawing to the game area (pixel 288 to 1024)
        game.ctx.beginPath();
        game.ctx.rect(0, 288, 1024, 736); // x, y, width, height
        game.ctx.clip();
        
        game.ctx.translate(0, 288);
        
        // Calculate positions for old and new rooms
        let oldOffsetX = 0, oldOffsetY = 0;
        let newOffsetX = 0, newOffsetY = 0;
        
        switch (transition.direction) {
            case 'north':
                // Old room slides up (negative Y), new room starts below and slides up
                oldOffsetY = transition.cameraOffsetY;
                newOffsetY = transition.cameraOffsetY - 704; // Below old room
                break;
            case 'south':
                // Old room slides down (positive Y), new room starts above and slides down
                oldOffsetY = transition.cameraOffsetY;
                newOffsetY = transition.cameraOffsetY + 704; // Above old room
                break;
            case 'west':
                // Old room slides left (negative X), new room starts right and slides left
                oldOffsetX = transition.cameraOffsetX;
                newOffsetX = transition.cameraOffsetX - 1024; // Right of old room
                break;
            case 'east':
                // Old room slides right (positive X), new room starts left and slides right
                oldOffsetX = transition.cameraOffsetX;
                newOffsetX = transition.cameraOffsetX + 1024; // Left of old room
                break;
        }
        
        // Draw old room
        this.drawTilemap(game, transition.oldRoom.tiles, oldOffsetX, oldOffsetY);
        
        // Draw new room
        this.drawTilemap(game, transition.newRoom.tiles, newOffsetX, newOffsetY);
        
        game.ctx.restore();
    }
    
    drawTilemap(game, tiles, offsetX = 0, offsetY = 0) {
        const tileImage = ASSET_MANAGER.getAsset('./sprites/tileset.png');
        
        // 16 tiles wide, 11 tiles tall
        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[y].length; x++) {
                const tileIndex = tiles[y][x];
                
                // Tileset has 18 columns and 1 pixel spacing
                const srcX = (tileIndex % 18) * 17 + 1;
                const srcY = Math.floor(tileIndex / 18) * 17 + 1;
                
                // Draw tile at 64x64 (4x scale) with offset
                game.ctx.drawImage(
                    tileImage,
                    srcX, srcY, 16, 16,                        // Source in tileset
                    x * 64 + offsetX, y * 64 + offsetY, 64, 64 // Destination on canvas
                );
            }
        }
    }
}
