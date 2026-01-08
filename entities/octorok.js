// Octorok entity factory - creates a wandering enemy
function createOctorok(game, x, y) {
    // Animation data - adjust coordinates based on enemies.png spritesheet
    const octorokAnimations = {
        'idle-down': {
            frames: [{x: 0, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-left': {
            frames: [{x: 30, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-up': {
            frames: [{x: 60, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-right': {
            frames: [{x: 90, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        
        // Walk animations (same as idle for now - can add movement frames later)
        'walk-down': {
            frames: [
                {x: 0, y: 0, width: 16, height: 16},
                {x: 0, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-left': {
            frames: [
                {x: 30, y: 0, width: 16, height: 16},
                {x: 30, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-up': {
            frames: [
                {x: 60, y: 0, width: 16, height: 16},
                {x: 60, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-right': {
            frames: [
                {x: 90, y: 0, width: 16, height: 16},
                {x: 90, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        }
    };
    
    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        facing: new Facing('down'),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            0, 0, 16, 16
        ),
        animator: new Animator(octorokAnimations, 'idle-down'),
        collider: new Collider(48, 48, 8, 8),        // 48x48 collision box, slightly offset
        hurtbox: new Collider(48, 48, 8, 8),         // Same as collider - can be damaged anywhere
        hitbox: new Collider(48, 48, 8, 8),          // Same as collider - deals contact damage
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        randomMovement: new RandomMovement(80, 1.5), // 80 px/s, change every 1.5 seconds
        health: new Health(2, 2),                     // 1 full heart (2 half-hearts)
        enemy: new Enemy(1)                           // Deals 0.5 hearts damage on touch
    };
    
    game.addEntity(entity);
    return entity;
}
