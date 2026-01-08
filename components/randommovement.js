// RandomMovement component - stores wandering AI behavior parameters
class RandomMovement {
    constructor(speed = 80, changeInterval = 1.5) {
        this.speed = speed;                    // Movement speed in pixels/second
        this.changeInterval = changeInterval;  // Seconds between direction changes
        this.changeTimer = 0;                  // Accumulated time since last change
    }
}
