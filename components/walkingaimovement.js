// WalkingAIMovement component - for ground-based enemies with random walking behavior
class WalkingAIMovement {
    constructor(speed = 80, changeInterval = 1.5) {
        this.speed = speed;                  // Movement speed in pixels per second
        this.changeInterval = changeInterval; // How often to randomly change direction (seconds)
        this.changeTimer = 0;                // Timer for direction changes
    }
}
