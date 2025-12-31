// Link entity factory - creates the player character
function createLink(game, x, y) {
    // Animation data - adjust frame coordinates if needed
    // Assuming: frame 1 in top row (y=0), frame 2 in second row (y=28 with 12px gap)
    // Arranged as: down, left, up, right
    const linkAnimations = {
        'idle-down': {
            frames: [{x: 0, y: 0}],
            duration: 0.2
        },
        'walk-down': {
            frames: [
                {x: 0, y: 0},   // Frame 1
                {x: 0, y: 30}   // Frame 2 (16 + 12px gap)
            ],
            duration: 0.15
        },
        'idle-left': {
            frames: [{x: 30, y: 0}],
            duration: 0.2
        },
        'walk-left': {
            frames: [
                {x: 30, y: 0},
                {x: 30, y: 30}
            ],
            duration: 0.15
        },
        'idle-up': {
            frames: [{x: 60, y: 0}],
            duration: 0.2
        },
        'walk-up': {
            frames: [
                {x: 60, y: 0},
                {x: 60, y: 30}
            ],
            duration: 0.15
        },
        'idle-right': {
            frames: [{x: 90, y: 0}],
            duration: 0.2
        },
        'walk-right': {
            frames: [
                {x: 90, y: 0},
                {x: 90, y: 30}
            ],
            duration: 0.15
        }
    };
    
    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        playercontrolled: new PlayerControlled(150),
        facing: new Facing('down'),  // Start facing down
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/link.png'),
            0,   // frameX - will be updated by AnimationSystem
            0,   // frameY - will be updated by AnimationSystem
            16,  // frameWidth
            16   // frameHeight
        ),
        animator: new Animator(linkAnimations, 'idle-down'),
        // Collision box - smaller than sprite, positioned at Link's body/feet
        collider: new Collider(
            64,  // width
            32,  // height
            0,   // offsetX - center horizontally
            32   // offsetY - move down so collision is at body/feet
        ),
        // Health - start with 3 full hearts (6 half-hearts)
        health: new Health(32, 6),
        // Inventory - start with no items
        inventory: new Inventory()
    };
    
    game.addEntity(entity);
    return entity;
}
