// Moblin entity factory - creates a wandering enemy that shoots arrows
function createMoblin(game, x, y, color, speed) {
    // Animation data - adjust coordinates based on enemies.png spritesheet
    // Moblins are at different positions than Octoroks
    let frameX = color === 'red' ? 0 : 120; // Red or blue Moblin
    const moblinAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Idle animations (16x16)
        'idle-down': {
            frames: [{x: frameX, y: 120, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-left': {
            frames: [{x: frameX + 30, y: 120, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-up': {
            frames: [{x: frameX + 60, y: 120, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-right': {
            frames: [{x: frameX + 90, y: 120, width: 16, height: 16}],
            duration: 0.2
        },
        
        // Walk animations
        'walk-down': {
            frames: [
                {x: frameX, y: 120, width: 16, height: 16},
                {x: frameX, y: 150, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-left': {
            frames: [
                {x: frameX + 30, y: 120, width: 16, height: 16},
                {x: frameX + 30, y: 150, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-up': {
            frames: [
                {x: frameX + 60, y: 120, width: 16, height: 16},
                {x: frameX + 60, y: 150, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-right': {
            frames: [
                {x: frameX + 90, y: 120, width: 16, height: 16},
                {x: frameX + 90, y: 150, width: 16, height: 16}
            ],
            duration: 0.15
        }
    };
    
    const start = Math.random() * 3.0; // Randomize initial shoot timer to avoid sync
    const health = color === 'red' ? 2 : 3; // Red Moblins have 2 hearts, blue have 3 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        facing: new Facing('down'),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(moblinAnimations, 'spawn'),
        collider: new Collider(48, 48, 8, 8),        // 48x48 collision box, slightly offset
        hurtbox: new Collider(48, 48, 8, 8),         // Same as collider - can be damaged anywhere
        hitbox: new Collider(48, 48, 8, 8),          // Same as collider - deals contact damage
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        walkingAIMovement: new WalkingAIMovement(speed, 1.5), // Speed px/s, change every 1.5 seconds
        health: new Health(health, health),          // 2 or 3 full hearts
        enemy: new Enemy(1),                         // Deals 0.5 hearts damage on touch
        team: new Team("enemy"),                     // Enemy team (prevents friendly fire)
        shootingState: new ShootingState(3.0, 0.5, start, 'arrow'),   // Shoot arrows every 3 seconds
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
