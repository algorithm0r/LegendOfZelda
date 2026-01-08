// Collectible component - marks an entity as collectible with type-specific data
class Collectible {
    constructor(type, data = {}) {
        this.type = type;      // 'sword', 'heart', 'rupee', 'key', 'bomb', 'item', 'heart-container', etc.
        this.data = data;      // Type-specific data (e.g., {tier: 1}, {amount: 5})
        this.collected = false; // Prevents double-collection
    }
}
