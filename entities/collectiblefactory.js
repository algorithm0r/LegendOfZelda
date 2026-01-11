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
            if (swordTier === 1) swordX = 0;      // Wooden sword
            else if (swordTier === 2) swordX = 16; // White sword
            else if (swordTier === 3) swordX = 32; // Magical sword
            
            entity.sprite = new Sprite(itemsImage, swordX, 0, 16, 16);
            break;
        
        case 'heart':
            // Heart sprite
            const heartAnimation = {
                'heart': {
                    frames: [
                        { x: 240, y: 195, width: 16, height: 16 },
                        { x: 270, y: 195, width: 16, height: 16 }
                    ],
                    duration: 0.02
                }
            }
            const linkImage = ASSET_MANAGER.getAsset('./sprites/link.png');
            entity.sprite = new Sprite(linkImage, 240, 195, 16, 16);
            entity.animator = new Animator(heartAnimation, 'heart');
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
            if (rupeeAmount === 1) rupeeX = 160;      // Flickering rupee
            else if (rupeeAmount === 5) rupeeX = 200;  // Blue rupee
            
            const rupeeAnimation = {
                'rupee': {
                    frames: [
                        { x: 160, y: 120, width: 16, height: 16 },
                        { x: 200, y: 120, width: 16, height: 16 }
                    ],
                    duration: 0.02
                }
            }

            entity.sprite = new Sprite(itemsImage, rupeeX, 120, 16, 16);
            if(rupeeAmount === 1) entity.animator = new Animator(rupeeAnimation, 'rupee');
            break;
        
        case 'key':
            // Key sprite
            entity.sprite = new Sprite(itemsImage, 128, 0, 16, 16);
            break;
        
        case 'bomb-pickup':
            // Bomb pickup sprite
            entity.sprite = new Sprite(itemsImage, 200, 0, 16, 16);
            break;
        
        case 'fairy':
            // Fairy sprite
            const fairyAnimation = {
                'fairy': {
                    frames: [
                        { x: 120, y: 40, width: 16, height: 16 },
                        { x: 160, y: 40, width: 16, height: 16 }
                    ],
                    duration: 0.1
                }
            }
            entity.sprite = new Sprite(itemsImage, 120, 40, 16, 16);
            entity.animator = new Animator(fairyAnimation, 'fairy');
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
