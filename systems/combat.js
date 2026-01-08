// CombatSystem - handles damage when hitboxes overlap hurtboxes
class CombatSystem {
    update(deltaTime, game) {
        // Check debug mode
        const debugModeCheckbox = document.getElementById('debugMode');
        const debugMode = debugModeCheckbox.checked;
        
        // Find all entities with hitboxes (attackers)
        const attackers = game.entities.filter(e => 
            e.hitbox && e.damage && e.position
        );
        
        // Find all entities with hurtboxes (can be damaged)
        const targets = game.entities.filter(e => 
            e.hurtbox && e.health && e.position
        );
        
        // Debug logging
        if (debugMode && (attackers.length > 0 || targets.length > 0)) {
            console.log(`CombatSystem: ${attackers.length} attackers, ${targets.length} targets`);
        }
        
        // Check each attacker against each target
        for (let attacker of attackers) {
            for (let target of targets) {
                // Don't let entities damage themselves
                if (attacker === target) continue;
                
                // Skip if target is invincible
                if (target.invincibility) continue;
                
                // Check if hitbox overlaps hurtbox
                if (this.checkCollision(attacker, target)) {
                    if (debugMode) {
                        console.log('HIT DETECTED!', attacker, target);
                    }
                    
                    // Apply damage
                    target.health.current -= attacker.damage.amount;
                    
                    // Apply invincibility (1.5 seconds)
                    target.invincibility = new Invincibility(1.5, 0.1);
                    
                    // Apply knockback if target has velocity
                    if (target.velocity) {
                        // Calculate direction from attacker to target
                        let dx = target.position.x - attacker.position.x;
                        let dy = target.position.y - attacker.position.y;
                        // select max and normalize to 1
                        if (Math.abs(dx) > Math.abs(dy)) {
                            dx = dx > 0 ? 1 : -1;
                            dy = 0;
                        } else {
                            dy = dy > 0 ? 1 : -1;
                            dx = 0;
                        }
                        
                        // Apply knockback (normalize direction and multiply by speed)
                        const knockbackSpeed = 720;
                        target.knockback = new Knockback(
                            dx * knockbackSpeed,
                            dy * knockbackSpeed,
                            0.3  // 0.3 second duration
                        );
                    }
                    
                    
                    // Check for death
                    if (target.health.current <= 0) {
                        target.removeFromWorld = true;
                    }
                }
            }
        }
    }
    
    checkCollision(attacker, target) {
        // Calculate attacker's hitbox position
        const hitbox = {
            x: attacker.position.x + attacker.hitbox.offsetX,
            y: attacker.position.y + attacker.hitbox.offsetY,
            width: attacker.hitbox.width,
            height: attacker.hitbox.height
        };
        
        // Calculate target's hurtbox position
        const hurtbox = {
            x: target.position.x + target.hurtbox.offsetX,
            y: target.position.y + target.hurtbox.offsetY,
            width: target.hurtbox.width,
            height: target.hurtbox.height
        };
        
        return checkAABBCollision(hitbox, hurtbox);
    }
}
