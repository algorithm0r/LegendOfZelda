// Transition component - stores data for room transition animation
class Transition {
    constructor(oldRoom, newRoom, direction) {
        this.oldRoom = oldRoom;    // {row, col, tiles}
        this.newRoom = newRoom;    // {row, col, tiles}
        this.direction = direction; // 'north', 'south', 'east', 'west'
        this.timer = 0;
        this.duration = 1.0;       // 1 second transition
        this.cameraOffsetX = 0;    // Calculated by TransitionSystem
        this.cameraOffsetY = 0;    // Calculated by TransitionSystem
    }
}
