// ExpirationSystem - removes entities after their lifetime expires
class ExpirationSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.lifetime) {
                entity.lifetime.elapsed += deltaTime;
                
                // Remove entity if lifetime expired
                if (entity.lifetime.elapsed >= entity.lifetime.duration) {
                    entity.removeFromWorld = true;
                }
            }
        }
    }
}
