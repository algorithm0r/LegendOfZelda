// PickupAnimationSystem - handles the pickup animation timing
class PickupAnimationSystem {
    update(deltaTime, game) {
        // Find player with pickup animation
        const player = game.entities.find(e => e.playercontrolled && e.pickupAnimation);
        if (!player) return;
        
        const anim = player.pickupAnimation;
        
        // Update timer
        anim.timer += deltaTime;
        
        // Check if animation complete
        if (anim.timer >= anim.duration) {
            anim.phase = 'complete';
            player.pickupAnimation = null; // Remove component
            // TODO: Resume normal gameplay music
        }
        
        // Animation is active - freeze player
        player.velocity.dx = 0;
        player.velocity.dy = 0;
    }
}
