// KnockbackSystem - handles knockback movement when entities are hit
class KnockbackSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.knockback && entity.velocity) {
                // Update knockback timer
                entity.knockback.elapsed += deltaTime;
                
                // Override velocity with knockback velocity
                entity.velocity.dx = entity.knockback.dx;
                entity.velocity.dy = entity.knockback.dy;
                
                // Remove knockback when duration expires
                if (entity.knockback.elapsed >= entity.knockback.duration) {
                    delete entity.knockback;
                }
            }
        }
    }
}
