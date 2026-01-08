// AttackSystem - manages attack timing and spawns sword hitboxes
class AttackSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.attackState) {
                // Update cooldown timer
                if (entity.attackState.cooldownTimer > 0) {
                    entity.attackState.cooldownTimer -= deltaTime;
                }
                
                // Update active attack
                if (entity.attackState.isAttacking) {
                    // Attack just started - spawn sword hitbox on first frame
                    if (entity.attackState.attackTimer === 0) {
                        this.spawnSwordHitbox(game, entity);
                    }
                    
                    entity.attackState.attackTimer += deltaTime;

                    // Attack finished
                    if (entity.attackState.attackTimer >= entity.attackState.attackDuration) {
                        entity.attackState.isAttacking = false;
                        entity.attackState.attackTimer = 0;
                        entity.attackState.cooldownTimer = entity.attackState.attackCooldown;
                    }
                }
            }
        }
    }
    
    spawnSwordHitbox(game, player) {
        const direction = player.facing.direction;
        
        // Position sword hitbox adjacent to Link based on direction
        let x, y;
        switch (direction) {
            case 'up':
                x = player.position.x;
                y = player.position.y - 64;
                break;
            case 'down':
                x = player.position.x;
                y = player.position.y + 64;
                break;
            case 'left':
                x = player.position.x - 64;
                y = player.position.y;
                break;
            case 'right':
                x = player.position.x + 64;
                y = player.position.y;
                break;
        }
        
        // Create sword hitbox entity (64x64 square)
        const hitbox = {
            position: new Position(x, y),
            lifetime: new Lifetime(0.3), // Exists for duration of attack
            hitbox: new Collider(64, 64, 0, 0),  // 64x64 hitbox covers sword area
            damage: new Damage(1),               // Deals 0.5 hearts (1 half-heart)
        };
        
        game.addEntity(hitbox);
        
        // TODO: Spawn sword beam if at full health
    }
}
