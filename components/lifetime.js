// Lifetime component - marks entity for automatic removal after duration
class Lifetime {
    constructor(duration) {
        this.duration = duration;  // Total lifetime in seconds
        this.elapsed = 0;          // Time elapsed so far
    }
}
