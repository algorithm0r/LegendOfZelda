// AttackState component - tracks attack state and timing
class AttackState {
    constructor() {
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackDuration = 0.3;   // 300ms swing duration
        this.attackCooldown = 0.1;   // 100ms cooldown between attacks
        this.cooldownTimer = 0;
    }
}
