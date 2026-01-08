// Pickup - handles collision detection and collection of items
class Pickup {
    update(deltaTime, game) {
        // Find player
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position || !player.collider || !player.inventory) return;
        
        // Skip collection during pickup animation
        if (player.pickupAnimation) return;
        
        // Check collision with all collectibles
        for (let entity of game.entities) {
            if (entity.collectible && !entity.collectible.collected && entity.position && entity.collider) {
                if (this.checkCollision(player, entity)) {
                    // Attempt to collect the item
                    if (this.tryCollect(player, entity.collectible)) {
                        // Collection successful - mark entity for removal
                        entity.collectible.collected = true;
                        entity.removeFromWorld = true;
                        
                        // Create pickup animation for important items
                        if (this.shouldAnimate(entity.collectible)) {
                            player.pickupAnimation = new PickupAnimation(entity.collectible, entity.sprite);
                        }
                        // TODO: Play pickup sound for non-animated items
                    }
                    // If tryCollect returns false, item remains on map (player full/already has it)
                }
            }
        }
    }
    
    // Determine which items should trigger animation
    shouldAnimate(collectible) {
        const type = collectible.type;
        
        // Animate major items
        switch (type) {
            case 'sword':
            case 'heart-container':
            case 'item':          // Boomerang, bow, etc.
            case 'passive':       // Raft, ladder, etc.
            case 'triforce':
                return true;
            
            // Don't animate consumables
            case 'heart':
            case 'rupee':
            case 'key':
            case 'bomb-pickup':
                return false;
            
            default:
                return false;
        }
    }
    
    checkCollision(player, collectible) {
        // Calculate player's collision box
        const p1x = player.position.x + player.collider.offsetX;
        const p1y = player.position.y + player.collider.offsetY;
        const p1w = player.collider.width;
        const p1h = player.collider.height;
        
        // Calculate collectible's collision box
        const p2x = collectible.position.x + collectible.collider.offsetX;
        const p2y = collectible.position.y + collectible.collider.offsetY;
        const p2w = collectible.collider.width;
        const p2h = collectible.collider.height;
        
        // AABB collision detection
        return p1x < p2x + p2w &&
               p1x + p1w > p2x &&
               p1y < p2y + p2h &&
               p1y + p1h > p2y;
    }
    
    tryCollect(player, collectible) {
        const inventory = player.inventory;
        const type = collectible.type;
        const data = collectible.data;
        
        switch (type) {
            case 'sword':
                return this.collectSword(inventory, data);
            
            case 'heart':
                return this.collectHeart(player, data);
            
            case 'heart-container':
                return this.collectHeartContainer(player);
            
            case 'rupee':
                return this.collectRupee(inventory, data);
            
            case 'key':
                return this.collectKey(inventory, data);
            
            case 'bomb-pickup':
                return this.collectBombPickup(inventory, data);
            
            case 'item':
                return this.collectItem(inventory, data);
            
            case 'passive':
                return this.collectPassiveItem(inventory, data);
            
            case 'triforce':
                return this.collectTriforce(inventory);
            
            default:
                console.warn(`Unknown collectible type: ${type}`);
                return false;
        }
    }
    
    // Sword collection - auto-upgrade, higher tier replaces lower
    collectSword(inventory, data) {
        const newTier = data.tier || 1;
        if (newTier > inventory.swordTier) {
            inventory.swordTier = newTier;
            inventory.itemA = 'sword'; // Auto-equip to A slot
            
            if(newTier === 1) {
                SHOP_7_7.rooms[0][0].collectibles = [];
                SHOP_7_7.rooms[0][0].shopkeeper = null;
            }

            // delete shopkeeper after sword is collected
            gameEngine.entities = gameEngine.entities.filter(e => !(e.text));            

            return true;
        }
        return false; // Already have this tier or better
    }
    
    // Heart collection - heals player
    collectHeart(player, data) {
        const amount = data.amount || 2; // Default to 1 full heart (2 half-hearts)
        if (player.health.current < player.health.max) {
            player.health.current = Math.min(player.health.current + amount, player.health.max);
            return true;
        }
        return false; // Already at full health
    }
    
    // Heart container - permanent max health increase
    collectHeartContainer(player) {
        player.health.max += 2; // Add 1 full heart (2 half-hearts)
        player.health.current += 2; // Also heal the new heart
        return true; // Always collectible
    }
    
    // Rupee collection - add to counter
    collectRupee(inventory, data) {
        const amount = data.amount || 1;
        if (inventory.rupees < inventory.maxRupees) {
            inventory.rupees = Math.min(inventory.rupees + amount, inventory.maxRupees);
            return true;
        }
        return false; // Already at max rupees
    }
    
    // Key collection - add to counter
    collectKey(inventory, data) {
        const amount = data.amount || 1;
        if (inventory.keys < inventory.maxKeys) {
            inventory.keys = Math.min(inventory.keys + amount, inventory.maxKeys);
            return true;
        }
        return false; // Already at max keys
    }
    
    // Bomb pickup - add to counter
    collectBombPickup(inventory, data) {
        const amount = data.amount || 1;
        if (inventory.bombs < inventory.maxBombs) {
            inventory.bombs = Math.min(inventory.bombs + amount, inventory.maxBombs);
            
            // Auto-equip bombs to B slot if nothing equipped
            if (!inventory.itemB) {
                inventory.itemB = 'bombs';
            }
            return true;
        }
        return false; // Already at max bombs
    }
    
    // Equippable item collection - boomerang, bow, candle, etc.
    collectItem(inventory, data) {
        const itemName = data.name; // e.g., 'boomerang', 'bow', 'candle'
        const tier = data.tier || 1;
        
        // Check if already owned
        if (inventory.ownedItems.has(itemName)) {
            // If tiered item, check if new tier is higher
            // For now, we'll just reject duplicates
            // TODO: Handle tiered items like wooden/magical boomerang
            return false;
        }
        
        // Add to owned items
        inventory.ownedItems.add(itemName);
        
        // Auto-equip to B slot if empty
        if (!inventory.itemB) {
            inventory.itemB = itemName;
        }
        
        return true;
    }
    
    // Passive item collection - raft, ladder, power bracelet, etc.
    collectPassiveItem(inventory, data) {
        const itemName = data.name;
        
        switch (itemName) {
            case 'raft':
                if (inventory.hasRaft) return false;
                inventory.hasRaft = true;
                return true;
            
            case 'ladder':
                if (inventory.hasLadder) return false;
                inventory.hasLadder = true;
                return true;
            
            case 'power-bracelet':
                if (inventory.hasPowerBracelet) return false;
                inventory.hasPowerBracelet = true;
                return true;
            
            case 'magical-key':
                if (inventory.hasMagicalKey) return false;
                inventory.hasMagicalKey = true;
                return true;
            
            default:
                console.warn(`Unknown passive item: ${itemName}`);
                return false;
        }
    }
    
    // Triforce collection
    collectTriforce(inventory) {
        inventory.triforceCount++;
        return true; // Always collectible
    }
}
