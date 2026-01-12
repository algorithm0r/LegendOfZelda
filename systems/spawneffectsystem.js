// SpawnEffectSystem - handles poof spawn animations
class SpawnEffectSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.spawnEffect && entity.spawnEffect.spawning) {
                // On first frame, spawn poof visual effect
                if (entity.spawnEffect.timer === 0) {
                    EFFECT_FACTORY.createPoof(game, entity.position.x, entity.position.y, entity.spawnEffect.duration);
                }
                
                // Update timer
                entity.spawnEffect.timer += deltaTime;
                
                // Spawn complete
                if (entity.spawnEffect.timer >= entity.spawnEffect.duration) {
                    entity.spawnEffect.spawning = false;
                }
            }
        }
    }
}
