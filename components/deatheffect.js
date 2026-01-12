// DeathEffect component - defines what visual effect to spawn when entity is destroyed
class DeathEffect {
    constructor(type = 'sparkle', duration = 0.5) {
        this.type = type;        // 'sparkle', 'particles', 'explosion', etc.
        this.duration = duration; // How long the effect lasts
    }
}
