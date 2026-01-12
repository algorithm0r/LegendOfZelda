// DeathEffectSystem - spawns visual effects when entities die
class DeathEffectSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            // Check if entity is marked for removal and has death effect
            if (entity.removeFromWorld && entity.deathEffect && !entity.effectSpawned) {
                // Spawn the effect
                EFFECT_FACTORY.create(game, entity);
                
                // Mark that we've spawned the effect to avoid duplicates
                entity.effectSpawned = true;
            }
        }
    }
}
