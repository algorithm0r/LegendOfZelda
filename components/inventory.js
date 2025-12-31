// Inventory component - tracks collectibles and equipped items
class Inventory {
    constructor() {
        this.rupees = 0;          // Rupee count
        this.keys = 0;            // Key count
        this.bombs = 0;           // Bomb count
        this.maxRupees = 255;     // Maximum rupees
        this.maxKeys = 9;         // Maximum keys
        this.maxBombs = 8;        // Maximum bombs
        
        this.itemB = null;        // Item equipped in B slot (e.g., 'boomerang', 'bow', 'bomb')
        this.itemA = null;        // Item equipped in A slot (usually sword)
    }
}
