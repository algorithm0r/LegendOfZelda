// Peahat entity factory - creates a flying enemy with state-based behavior
function createPeahat(game, x, y) {
    // Animation data - Peahats have different animation speeds per state
    const peahatAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Stopped state (static first frame)
        'stopped': {
            frames: [{x: 330, y: 270, width: 16, height: 16}],
            duration: 0.1
        },
        // Flying state (both frames, normal speed)
        'flying': {
            frames: [
                {x: 330, y: 270, width: 16, height: 16},
                {x: 360, y: 270, width: 16, height: 16}
            ],
            duration: 0.15
        },
        // Slowing state (both frames, slower animation)
        'slowing': {
            frames: [
                {x: 330, y: 270, width: 16, height: 16},
                {x: 360, y: 270, width: 16, height: 16}
            ],
            duration: 0.3
        },
        // Speeding state (both frames, slower animation)
        'speeding': {
            frames: [
                {x: 330, y: 270, width: 16, height: 16},
                {x: 360, y: 270, width: 16, height: 16}
            ],
            duration: 0.3
        }
    };
    
    const health = 2; // Peahats have 2 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(peahatAnimations, 'spawn'),
        // collider: new Collider(48, 48, 8, 8),        // 48x48 collision box
        hurtbox: new Collider(48, 48, 8, 8),         // Vulnerable in all states
        hitbox: new Collider(48, 48, 8, 8),          // Deals contact damage in all states
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        flyingAIMovement: new FlyingAIMovement(),    // Flying AI behavior
        health: new Health(health, health),          // 2 full hearts
        enemy: new Enemy(1),                         // Enemy marker
        team: new Team("enemy"),                     // Enemy team
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
