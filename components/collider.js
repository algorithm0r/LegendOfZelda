// Collider component - defines collision box for an entity
class Collider {
    constructor(width, height, offsetX = 0, offsetY = 0) {
        this.width = width;      // Width of collision box
        this.height = height;    // Height of collision box
        this.offsetX = offsetX;  // X offset from entity position
        this.offsetY = offsetY;  // Y offset from entity position
    }
}
