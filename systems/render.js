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
        
        // Draw all entities on top
        for (let entity of game.entities) {
            if (entity.position) {
                if (entity.sprite) {
                    // Draw sprite with 4x scaling (16x16 -> 64x64)
                    game.ctx.drawImage(
                        entity.sprite.image,
                        entity.sprite.frameX,          // Source X in spritesheet
                        entity.sprite.frameY,          // Source Y in spritesheet
                        entity.sprite.frameWidth,      // Source width (16)
                        entity.sprite.frameHeight,     // Source height (16)
                        entity.position.x,             // Destination X
                        entity.position.y,             // Destination Y
                        entity.sprite.frameWidth * 4,  // Destination width (64)
                        entity.sprite.frameHeight * 4  // Destination height (64)
                    );
                } else {
                    // Fallback: draw colored box for entities without sprites
                    game.ctx.fillStyle = 'red';
                    game.ctx.fillRect(entity.position.x, entity.position.y, 64, 64);
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
