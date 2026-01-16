// HoppingAIMovement component - for enemies that hop in arcs
class HoppingAIMovement {
    constructor(jumpDuration, pauseDuration, arcHeight) {
        this.jumpDuration = jumpDuration;     // Time to complete jump
        this.pauseDuration = pauseDuration;   // Wait time after landing
        this.arcHeight = arcHeight;           // Peak height above start position
        
        this.state = 'landed';  // 'landed' or 'jumping'
        this.timer = 0;
        
        // Jump trajectory data
        this.startX = 0;
        this.startY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.jumpProgress = 0;  // 0.0 to 1.0
    }
}
