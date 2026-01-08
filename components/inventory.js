// Inventory component - tracks collectibles and equipped items
class Inventory {
    constructor() {
        // Permanent upgrades
        this.swordTier = 0;       // 0=none, 1=wooden, 2=white, 3=magical
        this.armorTier = 0;       // 0=green tunic, 1=blue ring, 2=red ring
        
        // Consumable resources
        this.rupees = 0;          // Rupee count
        this.keys = 0;            // Key count
        this.bombs = 0;           // Bomb count
        this.maxRupees = 255;     // Maximum rupees
        this.maxKeys = 9;         // Maximum keys
        this.maxBombs = 8;        // Maximum bombs
        
        // Equipped items
        this.itemB = null;        // Item equipped in B slot (e.g., 'boomerang', 'bow', 'bombs')
        this.itemA = null;        // Item equipped in A slot (usually 'sword')
        
        // Owned items (can be equipped in B slot)
        this.ownedItems = new Set();  // Set of item names: 'boomerang', 'bow', 'candle', etc.
        
        // Passive items (always active once obtained)
        this.hasRaft = false;
        this.hasLadder = false;
        this.hasPowerBracelet = false;
        this.hasMagicalKey = false;
        
        // Quest items
        this.triforceCount = 0;
        this.hasMap = false;
        this.hasCompass = false;
    }
}
