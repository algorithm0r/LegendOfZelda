// ProjectileAISystem - manages enemy shooting behavior
class ProjectileAISystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.shootingState && entity.facing && entity.position) {
                if (entity.shootingState.isShooting) {
                    // Currently shooting - manage animation timer
                    entity.shootingState.shootAnimTimer += deltaTime;
                    
                    if (entity.shootingState.shootAnimTimer >= entity.shootingState.shootDuration) {
                        // Done shooting
                        entity.shootingState.isShooting = false;
                        entity.shootingState.shootAnimTimer = 0;
                    }
                } else {
                    // Don't shoot while spawning!
                    if (entity.spawnEffect && entity.spawnEffect.spawning) {
                        continue;  // Skip shooting logic
                    }
                    // Not shooting - count down to next shot
                    entity.shootingState.shootTimer += deltaTime;
                    
                    if (entity.shootingState.shootTimer >= entity.shootingState.shootInterval) {
                        // Time to shoot!
                        entity.shootingState.isShooting = true;
                        entity.shootingState.shootTimer = 0;
                        
                        // Spawn projectile based on enemy type
                        // For now, we'll assume Octoroks shoot rocks
                        // Later this could be expanded with a projectileType property
                        this.spawnProjectile(game, entity);
                    }
                }
            }
        }
    }
    
    spawnProjectile(game, shooter) {
        // For now, all shooting enemies shoot rocks
        // Later we can add a projectileType to ShootingState or Enemy component
        const direction = shooter.facing.direction;
        PROJECTILE_FACTORY.createRock(game, shooter, direction);
    }
}
