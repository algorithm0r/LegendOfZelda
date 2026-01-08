// PlayerInputSystem - translates keyboard input to velocity changes
class PlayerInputSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.playercontrolled && entity.velocity && entity.facing) {
                // Skip input during transitions, pickup animations, OR knockback
                if (entity.transition || entity.pickupAnimation || entity.knockback) {
                    entity.velocity.dx = 0;
                    entity.velocity.dy = 0;
                    return;
                }
                
                const speed = entity.playercontrolled.speed;
                
                // Reset velocity
                entity.velocity.dx = 0;
                entity.velocity.dy = 0;
                
                // Handle attack input (comma key = B button)
                if (entity.attackState && game.keys[',']) {
                    // Can only attack if not already attacking and cooldown finished
                    if (!entity.attackState.isAttacking && entity.attackState.cooldownTimer <= 0) {
                        entity.attackState.isAttacking = true;
                        entity.attackState.attackTimer = 0;
                    }
                }
                
                // Prevent movement during attack
                if (entity.attackState && entity.attackState.isAttacking) {
                    return; // Don't process movement input
                }
                
                // Check movement input
                if (game.keys['ArrowUp'] || game.keys['w']) {
                    entity.velocity.dy = -speed;
                    entity.facing.direction = 'up';
                }
                if (game.keys['ArrowDown'] || game.keys['s']) {
                    entity.velocity.dy = speed;
                    entity.facing.direction = 'down';
                }
                if (game.keys['ArrowLeft'] || game.keys['a']) {
                    entity.velocity.dx = -speed;
                    entity.facing.direction = 'left';
                }
                if (game.keys['ArrowRight'] || game.keys['d']) {
                    entity.velocity.dx = speed;
                    entity.facing.direction = 'right';
                }
            }
        }
    }
}
