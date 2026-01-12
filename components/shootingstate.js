// ShootingState component - manages enemy shooting behavior
class ShootingState {
    constructor(interval = 2.0, duration = 0.3, start = 0.0) {
        this.shootTimer = start;           // Time until next shot
        this.shootInterval = interval;  // Time between shots
        this.isShooting = false;        // Currently in shooting pose
        this.shootDuration = duration;  // How long to pause while shooting
        this.shootAnimTimer = 0;        // Timer for shooting animation/pause
    }
}
