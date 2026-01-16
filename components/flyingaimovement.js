// FlyingAIMovement component - for flying enemies with state-based behavior
class FlyingAIMovement {
    constructor() {
        this.state = 'stopped';  // 'flying', 'slowing', 'stopped', 'speeding'
        this.timer = Math.random() * 2.0;
        
        // State durations
        this.flyingDuration = 3.0;
        this.slowingDuration = 1.0;
        this.stoppedDuration = 2.0;
        this.speedingDuration = 1.0;
        
        // Movement speeds
        this.flyingSpeed = 100;
        this.slowingSpeed = 50;
        this.speedingSpeed = 50;
        
        // Target position for flying state
        this.targetX = 0;
        this.targetY = 0;
    }
}
