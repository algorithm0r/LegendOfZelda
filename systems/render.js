// RenderSystem - draws tilemap and all entities with position
class RenderSystem {
    update(deltaTime, game) {
        // Clear the canvas
        game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);
        
        // Draw background tilemap first
        if (game.currentLevel) {
            this.drawTilemap(game);
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
    }
    
    drawTilemap(game) {
        const level = game.currentLevel;
        const tileImage = ASSET_MANAGER.getAsset('./sprites/tileset.png');
        
        // 16 tiles wide, 11 tiles tall (or 12 if you want UI space)
        for (let y = 0; y < level.tiles.length; y++) {
            for (let x = 0; x < level.tiles[y].length; x++) {
                const tileIndex = level.tiles[y][x];
                
                // Tileset has 18 columns
                const srcX = (tileIndex % 18) * 17 + 1;
                const srcY = Math.floor(tileIndex / 18) * 17 + 1;
                
                // Draw tile at 64x64 (4x scale)
                game.ctx.drawImage(
                    tileImage,
                    srcX, srcY, 16, 16,      // Source in tileset
                    x * 64, (y + 1.5) * 64, 64, 64   // Destination on canvas
                );
            }
        }
    }
}
