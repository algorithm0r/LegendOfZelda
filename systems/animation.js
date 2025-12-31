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
    
    updateAnimation(entity) {
        // Determine animation based on movement and facing direction
        if (entity.facing && entity.velocity) {
            const isMoving = entity.velocity.dx !== 0 || entity.velocity.dy !== 0;
            const direction = entity.facing.direction;
            
            // Choose walk or idle animation
            const newAnim = isMoving ? `walk-${direction}` : `idle-${direction}`;
            
            // Only change animation if it's different (prevents restarting same animation)
            if (entity.animator.currentAnimation !== newAnim) {
                entity.animator.currentAnimation = newAnim;
                entity.animator.currentFrame = 0;
                entity.animator.frameTimer = 0;
            }
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
    }
}
