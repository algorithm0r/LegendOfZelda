// Zora entity factory - creates an aquatic enemy that emerges from water
function createZora(game, x, y, color, validWaterTiles) {
    // Animation data - Zoras emerge from water and shoot
    let frameY = color === 'red' ? 300 : 330; // Red or blue Zora
    const zoraAnimations = {
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
                {x: 120, y: frameY, width: 16, height: 16},
                {x: 150, y: frameY, width: 16, height: 16}
            ],
            duration: 0.5  // 1 second total for emerging
        },
        // Surfaced facing down
        'surfaced-down': {
            frames: [{x: 180, y: frameY, width: 16, height: 16}],
            duration: 0.1
        },
        // Surfaced facing up
        'surfaced-up': {
            frames: [{x: 210, y: frameY, width: 16, height: 16}],
            duration: 0.1
        },
        // Submerging animation (reverse of emerging)
        'submerging': {
            frames: [
                {x: 150, y: frameY, width: 16, height: 16},
                {x: 120, y: frameY, width: 16, height: 16}
            ],
            duration: 0.5  // 1 second total for submerging
        }
    };
    
    const health = 2; // Zoras have 2 hearts

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0), // Zoras don't move
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(zoraAnimations, 'spawn'),
        hurtbox: new Collider(48, 48, 8, 8),         // Vulnerable when surfaced
        hitbox: new Collider(48, 48, 8, 8),          // Deals contact damage when surfaced
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        burrowAIMovement: new BurrowAIMovement({
            isZora: true,
            moveSpeed: 0,
            validSpawnTiles: validWaterTiles
        }),
        health: new Health(health, health),          // 2 full hearts
        enemy: new Enemy(1),                         // Enemy marker
        team: new Team("enemy"),                     // Enemy team
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
