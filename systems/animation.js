// AnimationSystem - updates entity animations based on their state
class AnimationSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.animator && entity.sprite) {
                // Determine which animation should be playing
                this.updateAnimation(entity);
                
                // Update frame timer and advance frames
                this.updateFrames(entity, deltaTime);
            }
        }
    }
    
    resetIfNew(entity, newAnim) {
        if (entity.animator.currentAnimation !== newAnim) {
            entity.animator.currentAnimation = newAnim;
            entity.animator.currentFrame = 0;
            entity.animator.frameTimer = 0;
        }
    }

    updateAnimation(entity) {
        if(entity.spawnEffect && entity.spawnEffect.spawning) {
            // During spawn effect, show "spawn" animation
            const newAnim = 'spawn';
            this.resetIfNew(entity, newAnim);
            return; // Don't process other animations during spawn
        }
        
        // Hopping enemies use 'landed' or 'hopping' animation
        if (entity.hoppingAIMovement) {
            const newAnim = entity.hoppingAIMovement.state;
            this.resetIfNew(entity, newAnim);
            return; // Don't process other animations for hoppers
        }
        
        // Flying enemies use state-based animations
        if (entity.flyingAIMovement) {
            const newAnim = entity.flyingAIMovement.state;
            this.resetIfNew(entity, newAnim);
            return; // Don't process other animations for flyers
        }
        
        // Burrowing enemies use state-based animations
        if (entity.burrowAIMovement) {
            let newAnim = entity.burrowAIMovement.state;
            
            // Special case: Zora surfaced animation depends on facing direction
            if (entity.burrowAIMovement.isZora && entity.burrowAIMovement.state === 'surfaced') {
                newAnim = 'surfaced-' + entity.burrowAIMovement.facingDirection;
            }
            
            this.resetIfNew(entity, newAnim);
            return; // Don't process other animations for burrowers
        }
        
        if (entity.pickupAnimation) {
            // During pickup animation, show "hold-item" pose
            const newAnim = 'hold-item';
            this.resetIfNew(entity, newAnim);
     
            return; // Don't process other animations during pickup
        }
        // Determine animation based on movement and facing direction
        if (entity.facing && entity.velocity) {
            // Attack animation takes priority
            if (entity.attackState && entity.attackState.isAttacking) {
                const direction = entity.facing.direction;
                const newAnim = `attack-${direction}`;
                this.resetIfNew(entity, newAnim);
                return; // Don't process movement animations
            }
            
            const isMoving = entity.velocity.dx !== 0 || entity.velocity.dy !== 0;
            const direction = entity.facing.direction;
            
            // Choose walk or idle animation
            const newAnim = isMoving ? `walk-${direction}` : `idle-${direction}`;
            
            // Only change animation if it's different (prevents restarting same animation)
            this.resetIfNew(entity, newAnim);
        }
    }
    
    updateFrames(entity, deltaTime) {
        const anim = entity.animator.animations[entity.animator.currentAnimation];
        if (!anim) return;
        
        // Single frame animations don't need to advance
        if (anim.frames.length === 1) {
            const frame = anim.frames[0];
            entity.sprite.frameX = frame.x;
            entity.sprite.frameY = frame.y;
            // Update sprite dimensions if specified in frame (for attack sprites, etc)
            if (frame.width !== undefined) entity.sprite.frameWidth = frame.width;
            if (frame.height !== undefined) entity.sprite.frameHeight = frame.height;
            return;
        }
        
        // Update timer
        entity.animator.frameTimer += deltaTime;
        
        // Advance frame when timer exceeds duration
        if (entity.animator.frameTimer >= anim.duration) {
            entity.animator.frameTimer = 0;
            entity.animator.currentFrame = (entity.animator.currentFrame + 1) % anim.frames.length;
        }
        
        // Update sprite to show current frame
        const frame = anim.frames[entity.animator.currentFrame];
        entity.sprite.frameX = frame.x;
        entity.sprite.frameY = frame.y;
        // Update sprite dimensions if specified in frame
        if (frame.width !== undefined) entity.sprite.frameWidth = frame.width;
        if (frame.height !== undefined) entity.sprite.frameHeight = frame.height;
    }
}
