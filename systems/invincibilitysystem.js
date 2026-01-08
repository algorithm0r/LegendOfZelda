// InvincibilitySystem - manages invincibility timers
class InvincibilitySystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.invincibility) {
                // Update timer
                entity.invincibility.elapsed += deltaTime;
                
                // Remove invincibility when duration expires
                if (entity.invincibility.elapsed >= entity.invincibility.duration) {
                    delete entity.invincibility;
                }
            }
        }
    }
}
