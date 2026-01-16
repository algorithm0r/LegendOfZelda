// FlyingAIMovementSystem - controls flying enemies with state-based movement
class FlyingAIMovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.flyingAIMovement && entity.position && entity.velocity) {
                const flying = entity.flyingAIMovement;
                
                // Don't process while spawning
                if ((entity.spawnEffect && entity.spawnEffect.spawning) ||
                    (entity.walkIn && entity.walkIn.spawning)) {
                    entity.velocity.dx = 0;
                    entity.velocity.dy = 0;
                    continue;
                }
                
                // Update state timer
                flying.timer += deltaTime;
                
                // Handle current state
                switch(flying.state) {
                    case 'flying':
                        this.updateFlying(entity, flying, game);
                        if (flying.timer >= flying.flyingDuration) {
                            this.transitionToSlowing(entity, flying);
                        }
                        break;
                        
                    case 'slowing':
                        this.updateSlowing(entity, flying);
                        if (flying.timer >= flying.slowingDuration) {
                            this.transitionToStopped(entity, flying);
                        }
                        break;
                        
                    case 'stopped':
                        entity.velocity.dx = 0;
                        entity.velocity.dy = 0;
                        if (flying.timer >= flying.stoppedDuration) {
                            this.transitionToSpeeding(entity, flying);
                        }
                        break;
                        
                    case 'speeding':
                        this.updateSpeeding(entity, flying);
                        if (flying.timer >= flying.speedingDuration) {
                            this.transitionToFlying(entity, flying);
                        }
                        break;
                }
            }
        }
    }
    
    updateFlying(entity, flying, game) {
        // Move toward target
        const dx = flying.targetX - entity.position.x;
        const dy = flying.targetY - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If reached target (or very close), pick new target
        if (distance < 32) {
            this.pickNewTarget(entity, flying);
        }
        
        // Set velocity toward target
        if (distance > 0) {
            entity.velocity.dx = (dx / distance) * flying.flyingSpeed;
            entity.velocity.dy = (dy / distance) * flying.flyingSpeed;
        }
    }
    
    updateSlowing(entity, flying) {
        // Continue toward target but at slower speed
        const dx = flying.targetX - entity.position.x;
        const dy = flying.targetY - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            entity.velocity.dx = (dx / distance) * flying.slowingSpeed;
            entity.velocity.dy = (dy / distance) * flying.slowingSpeed;
        }
    }
    
    updateSpeeding(entity, flying) {
        // Start moving toward target at slow speed
        const dx = flying.targetX - entity.position.x;
        const dy = flying.targetY - entity.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            entity.velocity.dx = (dx / distance) * flying.speedingSpeed;
            entity.velocity.dy = (dy / distance) * flying.speedingSpeed;
        }
    }
    
    pickNewTarget(entity, flying) {
        // Pick random point with edge buffer (64 pixels from edges)
        const edgeBuffer = 64;
        const minX = edgeBuffer;
        const maxX = 960 - edgeBuffer;  // 1024 - 64
        const minY = edgeBuffer;
        const maxY = 640 - edgeBuffer;  // 704 - 64
        
        flying.targetX = minX + Math.random() * (maxX - minX);
        flying.targetY = minY + Math.random() * (maxY - minY);
    }
    
    transitionToSlowing(entity, flying) {
        flying.state = 'slowing';
        flying.timer = 0;
    }
    
    transitionToStopped(entity, flying) {
        flying.state = 'stopped';
        flying.timer = 0;
        entity.velocity.dx = 0;
        entity.velocity.dy = 0;
    }
    
    transitionToSpeeding(entity, flying) {
        flying.state = 'speeding';
        flying.timer = 0;
        // Pick new target for next flying phase
        this.pickNewTarget(entity, flying);
    }
    
    transitionToFlying(entity, flying) {
        flying.state = 'flying';
        flying.timer = 0;
    }
}
