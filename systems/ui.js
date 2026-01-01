// UISystem - renders the HUD (heads-up display)
class UISystem {
    constructor() {
        this.uiSprite = null; 
    }
    update(deltaTime, game) {

        if (!this.uiSprite) {
            this.uiSprite = ASSET_MANAGER.getAsset('./sprites/UI.png');
        }

        // Find the player entity to get health and inventory
        const player = game.entities.find(e => e.playercontrolled);
        if (!player) return;
        
        // Set up UI styling
        game.ctx.fillStyle = 'white';
        game.ctx.font = '32px "Press Start 2P"';
        game.ctx.textBaseline = 'top';
        
        // Draw UI elements
        this.drawCounters(game, player);
        this.drawItemSlots(game, player);
        this.drawHearts(game, player);
        this.drawMinimap(game, 48, 160);
    }
    
    drawCounters(game, player) {
        const inventory = player.inventory;
        if (!inventory) return;
        
        const x = 384;  // Left side of counters
        let y = 128;     // Starting Y position

        // Draw Rupee, key, and bomb icons from UI sprite
        game.ctx.drawImage(
            this.uiSprite,
            346, 27, 8, 32,        
            x - 32, y, 32, 128    
        );
        // Rupee counter
        game.ctx.fillText(`X${inventory.rupees.toString().padStart(2, '0')}`, x+4, y+4);
        y += 64;
        
        // Key counter  
        game.ctx.fillText(`X${inventory.keys.toString().padStart(1, '0')}`, x+4, y+4);
        y += 32;
        
        // Bomb counter
        game.ctx.fillText(`X${inventory.bombs.toString().padStart(1, '0')}`, x+4, y+4);
    }
    
    drawItemSlots(game, player) {
        const inventory = player.inventory;
        if (!inventory) return;
        
        // B button slot (left)
        const bX = 496;
        const bY = 144;
        
        const rectWidth = 64;
        const rectHeight = 96;
        // Draw B button background/outline
        game.ctx.strokeStyle = 'blue';
        game.ctx.lineWidth = 8;
        
        game.ctx.fillStyle = 'white';
        game.ctx.font = '32px "Press Start 2P"';

        game.ctx.roundRect(bX, bY, rectWidth, rectHeight, 8);
        game.ctx.stroke();
        
        // TODO: Draw B item icon here when items are implemented
        // if (inventory.itemB) { drawItem(inventory.itemB, bX, bY); }
        
        // A button slot (right)
        const aX = bX + 80;
        const aY = bY;
        
        // Draw A button background/outline
        game.ctx.roundRect(aX, aY, rectWidth, rectHeight, 8);
        game.ctx.stroke();
        
        game.ctx.fillText('B', bX + 20, bY - 16);
        game.ctx.fillText('A', aX + 20, aY - 16);
        
        // TODO: Draw A item icon (usually sword)
        // if (inventory.itemA) { drawItem(inventory.itemA, aX, aY); }
    }
    
    drawHearts(game, player) {
        const health = player.health;
        if (!health) return;
        
        const startX = 704;
        const startY = 128;
        
        // Draw "-LIFE-" text
        game.ctx.fillStyle = 'red';
        game.ctx.font = '32px "Press Start 2P"';
        game.ctx.fillText('-LIFE-', startX + 32, startY);
        
        // Draw hearts
        // Each full heart = 2 health points
        const numFullHearts = Math.floor(health.max / 2);
        const hasHalfHeart = health.max % 2 === 1;
        
        let heartX = startX;
        let heartY = startY + 96;
        
        for (let i = 0; i < numFullHearts; i++) {
            const heartValue = i * 2;
            
            // Determine which heart sprite to draw
            if (health.current > heartValue + 1) {
                // Full heart (both halves filled)
                this.drawFullHeart(game.ctx, heartX, heartY);
            } else if (health.current === heartValue + 1) {
                // Half heart (one half filled)
                this.drawHalfHeart(game.ctx, heartX, heartY);
            } else {
                // Empty heart
                this.drawEmptyHeart(game.ctx, heartX, heartY);
            }
            
            heartX += 32;
            
            // Wrap to next row after 8 hearts
            if ((i + 1) % 8 === 0) {
                heartX = startX;
                heartY -= 32;
            }
        }
        
        // Draw half heart container if max health is odd
        if (hasHalfHeart) {
            if (health.current >= health.max) {
                this.drawHalfHeart(game.ctx, heartX, heartY);
            } else {
                this.drawEmptyHeart(game.ctx, heartX, heartY);
            }
        }
    }
    
    // Helper methods to draw hearts
    // For now, drawing simple colored shapes - replace with sprites later
    drawFullHeart(ctx, x, y) {
        // Draw full heart using UI sprite
        ctx.drawImage(
            this.uiSprite,
            645, 117, 8, 8,        
            x, y, 32, 32    
        );
    }
    
    drawHalfHeart(ctx, x, y) {
        // Draw half heart using UI sprite
        ctx.drawImage(
            this.uiSprite,
            636, 117, 8, 8,        
            x, y, 32, 32    
        );
    }
    
    drawEmptyHeart(ctx, x, y) {
        // Draw empty heart using UI sprite
        ctx.drawImage(
            this.uiSprite,
            627, 117, 8, 8,        
            x, y, 32, 32    
        );
    }

    drawMinimap(game, x, y) {
        const ctx = game.ctx;
        // Draw one pixel for each tile in the overworld
        OVERWORLD.rooms.forEach((row, rowIndex) => {
            row.forEach((room, colIndex) => {
                const tiles = room.tiles;

                tiles.forEach((tileRow, tileRowIndex) => {
                    tileRow.forEach((tile, tileColIndex) => {
                        // Determine color based on tile type
                        switch (tile) {
                            case 6: case 7: case 9: case 10: case 11: case 25: case 26: case 27: case 29: case 42: case 43: case 44: case 45: case 46: case 47: case 60: case 61: case 62: case 63: case 65: 
                                ctx.fillStyle = 'green';
                                break;
                            case 72: case 73: case 74: case 90: case 91: case 92: case 108: case 109: case 110: case 78: case 79: case 80: case 96: case 97: case 98: case 114: case 115: case 116: case 84: case 85: case 86: case 102: case 103: case 104: case 120: case 121: case 122:
                                ctx.fillStyle = 'blue';
                                break;
                            case 0: case 1: case 3: case 4: case 5: case 19: case 20: case 21: case 23: case 36: case 37: case 38: case 39: case 40: case 41: case 54: case 55: case 56: case 57: case 59:  
                                ctx.fillStyle = 'red';
                                break;
                            case 12: case 13: case 15: case 16: case 17: case 31: case 32: case 33: case 35: case 48: case 49: case 50: case 51: case 52: case 53: case 66: case 67: case 68: case 69: case 71:
                                ctx.fillStyle = 'lightgray';
                                break;
                            default:
                                ctx.fillStyle = 'tan';
                        }
                        // Draw pixel   
                        if(rowIndex === game.currentLevel.row && colIndex === game.currentLevel.col) {
                            ctx.globalAlpha = 1.0;
                        } else {
                            ctx.globalAlpha = 0.5;
                        }   
                        ctx.fillRect(
                            x + (colIndex * 16) + tileColIndex,
                            y + (rowIndex * 11) + tileRowIndex,
                            1,
                            1
                        );
                    });
                });
            });
        });
        ctx.globalAlpha = 1.0;
    }
}
