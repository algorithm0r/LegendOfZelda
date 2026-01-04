// PlayerInputSystem - translates keyboard input to velocity changes
class PlayerInputSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.playercontrolled && entity.velocity && entity.facing) {
                // Skip input during transitions
                if (entity.transition) {
                    entity.velocity.dx = 0;
                    entity.velocity.dy = 0;
                    return;
                }
                
                const speed = entity.playercontrolled.speed;
                
                // Reset velocity
                entity.velocity.dx = 0;
                entity.velocity.dy = 0;
                
                // Check input
                if (game.keys['ArrowUp'] || game.keys['w']) {
                    entity.velocity.dy = -speed;
                    entity.facing.direction = 'up';
                }
                if (game.keys['ArrowDown'] || game.keys['s']) {
                    entity.velocity.dy = speed;
                    entity.facing.direction = 'down';
                }
                if (game.keys['ArrowLeft'] || game.keys['a']) {
                    entity.velocity.dx = -speed;
                    entity.facing.direction = 'left';
                }
                if (game.keys['ArrowRight'] || game.keys['d']) {
                    entity.velocity.dx = speed;
                    entity.facing.direction = 'right';
                }
            }
        }
    }
}
