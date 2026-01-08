// Invincibility component - prevents damage and causes flickering
class Invincibility {
    constructor(duration = 1.5, flickerInterval = 0.1) {
        this.duration = duration;             // Total invincibility time
        this.elapsed = 0;                     // Time elapsed
        this.flickerInterval = flickerInterval; // How fast to blink (seconds)
    }
}
