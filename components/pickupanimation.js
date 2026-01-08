// PickupAnimation component - stores data for item pickup animation
class PickupAnimation {
    constructor(collectible, sprite) {
        this.collectible = collectible; // The item being collected {type, data}
        this.sprite = sprite;
        this.timer = 0;
        this.duration = 2.0;            // 2 seconds like OG Zelda
    }
}
