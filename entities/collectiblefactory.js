// Collectible entity factory - creates collectible items at specified positions
function createCollectible(game, type, data, x, y) {
    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        collider: new Collider(32, 32, 16, 16), // Smaller collision box, centered
        collectible: new Collectible(type, data)
    };
    
    // Add sprite based on type
    const itemsImage = ASSET_MANAGER.getAsset('./sprites/items.png');
    
    switch (type) {
        case 'sword':
            // Sword sprite - different frames for different tiers
            const swordTier = data.tier || 1;
            let swordX = 0;
            if (swordTier === 1) { 
                swordX = 280;
                swordY = 120;      // Wooden sword
            }
            else if (swordTier === 2) {
                swordX = 360;
                swordY = 120;      // White sword
            }
            else if (swordTier === 3) {
                swordX = 90;
                swordY = 90;      // Magical sword
            }
            
            entity.sprite = new Sprite(itemsImage, swordX, swordY, 16, 16);
            break;
        
        case 'heart':
            // Heart sprite
            entity.sprite = new Sprite(itemsImage, 48, 0, 16, 16);
            // TODO: Add animator for pulsing effect
            break;
        
        case 'heart-container':
            // Heart container sprite
            entity.sprite = new Sprite(itemsImage, 64, 0, 16, 16);
            break;
        
        case 'rupee':
            // Rupee sprite - different colors for different values
            const rupeeAmount = data.amount || 1;
            let rupeeX = 0;
            if (rupeeAmount === 1) rupeeX = 80;      // Green rupee
            else if (rupeeAmount === 5) rupeeX = 96;  // Blue rupee
            else if (rupeeAmount === 20) rupeeX = 112; // Red rupee
            
            entity.sprite = new Sprite(itemsImage, rupeeX, 0, 16, 16);
            // TODO: Add animator for spinning/sparkling effect
            break;
        
        case 'key':
            // Key sprite
            entity.sprite = new Sprite(itemsImage, 128, 0, 16, 16);
            break;
        
        case 'bomb-pickup':
            // Bomb pickup sprite
            entity.sprite = new Sprite(itemsImage, 144, 0, 16, 16);
            break;
        
        case 'item':
            // Generic item sprite - position based on item name
            const itemName = data.name;
            let itemX = 0;
            
            switch (itemName) {
                case 'boomerang':
                    itemX = 160;
                    break;
                case 'bow':
                    itemX = 176;
                    break;
                case 'candle':
                    itemX = 192;
                    break;
                case 'whistle':
                    itemX = 208;
                    break;
                // Add more items as needed
                default:
                    itemX = 224; // Default/unknown item
            }
            
            entity.sprite = new Sprite(itemsImage, itemX, 0, 16, 16);
            break;
        
        case 'passive':
            // Passive item sprites
            const passiveName = data.name;
            let passiveX = 0;
            
            switch (passiveName) {
                case 'raft':
                    passiveX = 240;
                    break;
                case 'ladder':
                    passiveX = 256;
                    break;
                case 'power-bracelet':
                    passiveX = 272;
                    break;
                case 'magical-key':
                    passiveX = 288;
                    break;
                default:
                    passiveX = 304;
            }
            
            entity.sprite = new Sprite(itemsImage, passiveX, 0, 16, 16);
            break;
        
        case 'triforce':
            // Triforce sprite
            entity.sprite = new Sprite(itemsImage, 320, 0, 16, 16);
            // TODO: Add animator for glowing effect
            break;
        
        default:
            // Fallback sprite
            entity.sprite = new Sprite(itemsImage, 0, 16, 16, 16);
            console.warn(`Unknown collectible type: ${type}`);
    }
    
    game.addEntity(entity);
    return entity;
}
