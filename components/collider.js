// Collider component - defines collision boundaries for an entity
// Separate from sprite so visual and collision can differ
class Collider {
    constructor(width, height, offsetX = 0, offsetY = 0) {
        this.width = width;      // Width of collision box
        this.height = height;    // Height of collision box
        this.offsetX = offsetX;  // Offset from position.x
        this.offsetY = offsetY;  // Offset from position.y
    }
    
    // Helper to get the actual collision box in world space
    getBounds(position) {
        return {
            x: position.x + this.offsetX,
            y: position.y + this.offsetY,
            width: this.width,
            height: this.height
        };
    }
}
