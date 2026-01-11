// DropSystem - handles item drops when enemies die
class DropSystem {
    update(deltaTime, game) {
        // Find the player for need checking
        const player = game.entities.find(e => e.playercontrolled);
        if (!player) return;
        
        // Find all entities marked for removal that have drops
        const dyingEnemies = game.entities.filter(e => 
            e.removeFromWorld && e.drops && e.position
        );
        
        for (let enemy of dyingEnemies) {
            // Look up the drop table
            const dropTable = ENEMY_DROP_TABLES[enemy.drops.tableId];
            if (!dropTable) continue;
            
            // Roll for an item
            const rolledItem = this.rollDrop(dropTable);
            if (!rolledItem) continue;  // No drop this time
            
            // Check if player needs this item
            if (!this.playerNeedsItem(player, rolledItem)) {
                continue;  // Don't spawn if not needed
            }
            
            // Spawn the collectible
            this.spawnCollectible(game, enemy.position, rolledItem);
        }
    }
    
    rollDrop(dropTable) {
        // Roll a random number
        const roll = Math.random();
        
        // Check each item in the table
        let cumulativeChance = 0;
        for (let item of dropTable) {
            cumulativeChance += item.chance;
            if (roll < cumulativeChance) {
                return item;  // This item was rolled
            }
        }
        
        return null;  // No drop (roll exceeded all chances)
    }
    
    playerNeedsItem(player, item) {
        switch (item.type) {
            case 'rupee':
                // Check if rupees are maxed
                return player.inventory.rupees < player.inventory.maxRupees;
                
            case 'bomb':
                // Check if bombs are maxed
                return player.inventory.bombs < player.inventory.maxBombs;
                
            case 'heart':
                // Always allow hearts to drop
                return true; 
                
            case 'fairy':
                // Fairies can always drop (they're rare and special)
                return true;
                
            default:
                return true;
        }
    }
    
    spawnCollectible(game, position, item) {
        // Map drop types to factory types and build data object
        let factoryType = item.type;
        let factoryData = {};
        
        switch (item.type) {
            case 'rupee':
                factoryData = { amount: item.value };
                break;
            case 'heart':
                // Hearts use value directly (half-hearts restored)
                factoryData = { amount: item.value };
                break;
            case 'bomb':
                // Factory expects 'bomb-pickup' type
                factoryType = 'bomb-pickup';
                factoryData = { amount: item.value };
                break;
            case 'fairy':
                // Fairies don't need additional data
                factoryData = {};
                break;
            default:
                factoryData = { amount: item.value };
        }
        
        // Use CollectibleFactory to create the entity
        const collectible = createCollectible(
            game, 
            factoryType, 
            factoryData, 
            position.x, 
            position.y
        );
        
        // Add lifetime so drops expire after 10 seconds
        collectible.lifetime = new Lifetime(10);
    }
}
