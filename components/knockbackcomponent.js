// Knockback component - applies temporary forced movement when hit
class Knockback {
    constructor(dx, dy, duration = 0.3) {
        this.dx = dx;            // Knockback velocity X
        this.dy = dy;            // Knockback velocity Y
        this.duration = duration; // How long knockback lasts
        this.elapsed = 0;        // Time elapsed
    }
}
