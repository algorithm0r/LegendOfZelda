// Octorok entity factory - creates a wandering enemy that shoots rocks
function createOctorok(game, x, y, color, speed) {
    // Animation data - adjust coordinates based on enemies.png spritesheet
    let frameX = color === 'red' ? 0 : 120; // Red or blue Octorok
    const octorokAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Idle animations (16x16)
        'idle-down': {
            frames: [{x: frameX, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-left': {
            frames: [{x: frameX + 30, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-up': {
            frames: [{x: frameX + 60, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-right': {
            frames: [{x: frameX + 90, y: 0, width: 16, height: 16}],
            duration: 0.2
        },
        
        // Walk animations (same as idle for now - can add movement frames later)
        'walk-down': {
            frames: [
                {x: frameX, y: 0, width: 16, height: 16},
                {x: frameX, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-left': {
            frames: [
                {x: frameX + 30, y: 0, width: 16, height: 16},
                {x: frameX + 30, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-up': {
            frames: [
                {x: frameX + 60, y: 0, width: 16, height: 16},
                {x: frameX + 60, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-right': {
            frames: [
                {x: frameX + 90, y: 0, width: 16, height: 16},
                {x: frameX + 90, y: 30, width: 16, height: 16}
            ],
            duration: 0.15
        }
    };
    
    const start = Math.random() * 3.0; // Randomize initial shoot timer to avoid sync
    const health = color === 'red' ? 1 : 2; // Red Octoroks have 1 heart, blue have 2 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        facing: new Facing('down'),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(octorokAnimations, 'spawn'),
        collider: new Collider(48, 48, 8, 8),        // 48x48 collision box, slightly offset
        hurtbox: new Collider(48, 48, 8, 8),         // Same as collider - can be damaged anywhere
        hitbox: new Collider(48, 48, 8, 8),          // Same as collider - deals contact damage
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        randomMovement: new RandomMovement(speed, 1.5), // 80 px/s, change every 1.5 seconds
        health: new Health(health, health),                    // 1 or 2 full hearts (2 or 4 half-hearts)
        enemy: new Enemy(1),                         // Deals 0.5 hearts damage on touch
        team: new Team("enemy"),                     // Enemy team (prevents friendly fire)
        shootingState: new ShootingState(3.0, 0.5, start),   // Shoot every 3 seconds, pause 0.5s while shooting
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                         // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
