// PlayerInputSystem - handles keyboard input for player-controlled entities
class PlayerInputSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.playercontrolled && entity.velocity) {
                const speed = entity.playercontrolled.speed;
                
                // Reset velocity
                entity.velocity.dx = 0;
                entity.velocity.dy = 0;
                
                // Check keyboard input and update velocity and facing
                if (game.keys['ArrowUp'] || game.keys['w']) {
                    entity.velocity.dy = -speed;
                    if (entity.facing) entity.facing.direction = 'up';
                }
                if (game.keys['ArrowDown'] || game.keys['s']) {
                    entity.velocity.dy = speed;
                    if (entity.facing) entity.facing.direction = 'down';
                }
                if (game.keys['ArrowLeft'] || game.keys['a']) {
                    entity.velocity.dx = -speed;
                    if (entity.facing) entity.facing.direction = 'left';
                }
                if (game.keys['ArrowRight'] || game.keys['d']) {
                    entity.velocity.dx = speed;
                    if (entity.facing) entity.facing.direction = 'right';
                }
            }
        }
    }
}
