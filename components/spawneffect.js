// SpawnEffect component - marks entity as spawning with poof animation
class SpawnEffect {
    constructor(duration = 0.5) {
        this.spawning = true;   // Entity is currently spawning
        this.timer = 0;         // Time elapsed
        this.duration = duration; // How long spawn animation lasts
    }
}
