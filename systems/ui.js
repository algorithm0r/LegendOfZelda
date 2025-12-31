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
}
