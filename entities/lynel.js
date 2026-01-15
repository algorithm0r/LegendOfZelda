// Lynel entity factory - creates a powerful wandering enemy that shoots sword beams
function createLynel(game, x, y, color, speed) {
    // Animation data - Lynels are at row 9 and 10 (y=240 and y=270)
    let frameX = color === 'red' ? 0 : 120; // Red or blue Lynel
    const lynelAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Idle animations (16x16)
        'idle-down': {
            frames: [{x: frameX, y: 240, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-left': {
            frames: [{x: frameX + 30, y: 240, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-up': {
            frames: [{x: frameX + 60, y: 240, width: 16, height: 16}],
            duration: 0.2
        },
        'idle-right': {
            frames: [{x: frameX + 90, y: 240, width: 16, height: 16}],
            duration: 0.2
        },
        
        // Walk animations
        'walk-down': {
            frames: [
                {x: frameX, y: 240, width: 16, height: 16},
                {x: frameX, y: 270, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-left': {
            frames: [
                {x: frameX + 30, y: 240, width: 16, height: 16},
                {x: frameX + 30, y: 270, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-up': {
            frames: [
                {x: frameX + 60, y: 240, width: 16, height: 16},
                {x: frameX + 60, y: 270, width: 16, height: 16}
            ],
            duration: 0.15
        },
        'walk-right': {
            frames: [
                {x: frameX + 90, y: 240, width: 16, height: 16},
                {x: frameX + 90, y: 270, width: 16, height: 16}
            ],
            duration: 0.15
        }
    };
    
    const start = Math.random() * 3.0; // Randomize initial shoot timer to avoid sync
    const health = color === 'red' ? 4 : 6; // Red Lynels have 4 hearts, blue have 6 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        facing: new Facing('down'),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(lynelAnimations, 'spawn'),
        collider: new Collider(48, 48, 8, 8),        // 48x48 collision box, slightly offset
        hurtbox: new Collider(48, 48, 8, 8),         // Same as collider - can be damaged anywhere
        hitbox: new Collider(48, 48, 8, 8),          // Same as collider - deals contact damage
        damage: new Damage(2),                       // Deals 1 full heart on touch (tougher enemy!)
        walkingAIMovement: new WalkingAIMovement(speed, 1.5), // Speed px/s, change every 1.5 seconds
        health: new Health(health, health),          // 4 or 6 full hearts
        enemy: new Enemy(1),                         // Deals 0.5 hearts damage on touch
        team: new Team("enemy"),                     // Enemy team (prevents friendly fire)
        shootingState: new ShootingState(2.5, 0.5, start, 'swordbeam'),   // Shoot sword beams every 2.5 seconds
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
