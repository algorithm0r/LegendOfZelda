// Link entity factory - creates the player character
function createLink(game, x, y) {
    // Animation data
    const linkAnimations = {
        // Idle animations (16x16 - these reset dimensions after attacks)
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
        
        // Walk animations (16x16)
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
        },

        'hold-item': {
            frames: [{x: 0, y: 150, width: 16, height: 16}],
            duration: 2.0
        },
        
        // Attack animations (larger sprite dimensions)
        'attack-down': {
            frames: [{x: 0, y: 80, width: 16, height: 32}],  // 16x32 source → 64x128 rendered
            duration: 0.3
        },
        'attack-left': {
            frames: [{x: 20, y: 90, width: 32, height: 16}],  // 32x16 source → 128x64 rendered
            duration: 0.3
        },
        'attack-up': {
            frames: [{x: 60, y: 80, width: 16, height: 32}],  // 16x32 source → 64x128 rendered
            duration: 0.3
        },
        'attack-right': {
            frames: [{x: 84, y: 90, width: 32, height: 16}],  // 32x16 source → 128x64 rendered
            duration: 0.3
        }
    };
    
    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        playercontrolled: new PlayerControlled(240),
        facing: new Facing('down'),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/link.png'),
            0, 0, 16, 16
        ),
        animator: new Animator(linkAnimations, 'idle-down'),
        collider: new Collider(48, 32, 8, 28),
        hurtbox: new Collider(48, 32, 8, 28),  // Same as collider - body area
        attackState: new AttackState(),  // Add attack state
        health: new Health(6, 6),
        inventory: new Inventory(),
        team: new Team("player")  // Link is on the player team
    };
    
    game.addEntity(entity);
    return entity;
}
