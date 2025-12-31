// Sprite component - stores visual representation data
class Sprite {
    constructor(image, frameX = 0, frameY = 0, frameWidth = 16, frameHeight = 16) {
        this.image = image;           // The spritesheet image
        this.frameX = frameX;          // X position in spritesheet (pixels)
        this.frameY = frameY;          // Y position in spritesheet (pixels)
        this.frameWidth = frameWidth;  // Width of one frame (pixels)
        this.frameHeight = frameHeight; // Height of one frame (pixels)
    }
}
