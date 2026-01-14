// ShootingState component - manages enemy shooting behavior
class ShootingState {
    constructor(interval = 2.0, duration = 0.3, start = 0.0, projectileType = 'rock') {
        this.shootTimer = start;        // Time until next shot
        this.shootInterval = interval;   // Time between shots
        this.isShooting = false;         // Currently shooting
        this.shootDuration = duration;   // Pause duration while shooting
        this.shootAnimTimer = 0;         // Animation timer
        this.projectileType = projectileType; // Type of projectile to shoot ('rock', 'arrow', etc.)
    }
}
