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
                    if ((entity.spawnEffect && entity.spawnEffect.spawning) ||
                        (entity.walkIn && entity.walkIn.spawning)) {
                        continue;  // Skip shooting logic
                    }
                    // Not shooting - count down to next shot
                    entity.shootingState.shootTimer += deltaTime;
                    
                    if (entity.shootingState.shootTimer >= entity.shootingState.shootInterval) {
                        // Time to shoot!
                        entity.shootingState.isShooting = true;
                        entity.shootingState.shootTimer = 0;
                        
                        // Spawn projectile based on projectileType
                        this.spawnProjectile(game, entity);
                    }
                }
            }
        }
    }
    
    spawnProjectile(game, shooter) {
        const direction = shooter.facing.direction;
        const projectileType = shooter.shootingState.projectileType;
        
        // Create appropriate projectile based on type
        switch(projectileType) {
            case 'rock':
                PROJECTILE_FACTORY.createRock(game, shooter, direction);
                break;
            case 'arrow':
                PROJECTILE_FACTORY.createArrow(game, shooter, direction);
                break;
            // Future projectile types can be added here:
            // case 'fireball':
            //     PROJECTILE_FACTORY.createFireball(game, shooter, direction);
            //     break;
            default:
                console.warn(`Unknown projectile type: ${projectileType}`);
                break;
        }
    }
}
