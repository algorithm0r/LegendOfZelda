// Health component - tracks entity health and invincibility
class Health {
    constructor(max = 6, current = 6) {
        this.current = current;      // Current health (in half-hearts, so 3 = 1.5 hearts)
        this.max = max;          // Maximum health (in half-hearts)
        this.invincible = false; // Temporary invincibility after taking damage
        this.invincibleTimer = 0; // Timer for invincibility duration
    }
}
