// Leever entity factory - creates a burrowing enemy that charges at Link
function createLeever(game, x, y, color, validGroundTiles) {
    // Animation data - Leevers emerge from ground and charge
    let frameY = color === 'red' ? 300 : 330; // Red or blue Leever
    const leeverAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Burrowed (invisible)
        'burrowed': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Emerging animation (2 frames)
        'emerging': {
            frames: [
                {x: 240, y: 300, width: 16, height: 16},
                {x: 270, y: 300, width: 16, height: 16}
            ],
            duration: 0.5  // 1 second total for emerging
        },
        // Half out (brief pause, starts moving)
        'halfout': {
            frames: [{x: 300, y: frameY, width: 16, height: 16}],
            duration: 0.1
        },
        // Surfaced (2 frames animated)
        'surfaced': {
            frames: [
                {x: 330, y: frameY, width: 16, height: 16},
                {x: 360, y: frameY, width: 16, height: 16}
            ],
            duration: 0.15
        },
        // Submerging animation (reverse)
        'submerging': {
            frames: [
                {x: 270, y: 300, width: 16, height: 16},
                {x: 240, y: 300, width: 16, height: 16}
            ],
            duration: 0.33  // 1 second total (3 frames)
        }
    };
    
    const health = color === 'red' ? 2 : 4; // Red = 2 hearts, Blue = 4 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(leeverAnimations, 'spawn'),
        collider: new Collider(48, 48, 8, 8),        // For movement collision
        hurtbox: new Collider(48, 48, 8, 8),         // Vulnerable when surfaced
        hitbox: new Collider(48, 48, 8, 8),          // Deals contact damage when surfaced
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        burrowAIMovement: new BurrowAIMovement({
            isLeever: true,
            moveSpeed: 100,
            validSpawnTiles: validGroundTiles
        }),
        health: new Health(health, health),          // 2 or 4 full hearts
        enemy: new Enemy(1),                         // Enemy marker
        team: new Team("enemy"),                     // Enemy team
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
