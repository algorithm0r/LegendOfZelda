// BurrowAIMovement component - for enemies that emerge from ground/water
class BurrowAIMovement {
    constructor(config) {
        this.state = 'burrowed';  // 'burrowed', 'emerging', 'halfout', 'surfaced', 'submerging'
        this.timer = Math.random() * 2.0; // Randomized start
        
        // State durations
        this.burrowedDuration = 2.0;
        this.emergingDuration = 1.0;
        this.halfoutDuration = 0.3;  // Brief pause (Leever only)
        this.surfacedDuration = 3.0;
        this.submergingDuration = 1.0;
        
        // Movement (for Leever)
        this.moveSpeed = config.moveSpeed || 0;
        this.targetX = 0;
        this.targetY = 0;
        
        // Type flags
        this.isZora = config.isZora || false;
        this.isLeever = config.isLeever || false;
        
        // Shot flag (for Zora)
        this.hasShot = false;
        
        // Valid spawn tiles for relocation
        this.validSpawnTiles = config.validSpawnTiles || [];
        
        // Facing direction (for Zora)
        this.facingDirection = 'down'; // 'up' or 'down'
    }
}
