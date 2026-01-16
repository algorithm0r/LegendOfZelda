// Tektite entity factory - creates a hopping spider enemy
function createTektite(game, x, y, color) {
    // Animation data - Tektites have 2 states: landed and hopping
    let frameX = color === 'red' ? 240 : 270; // Red (orange) or blue Tektite
    const tektiteAnimations = {
        'spawn': {
            frames: [{x: 60, y: 330, width: 16, height: 16}],
            duration: 0.1
        },
        // Landed state (static frame)
        'landed': {
            frames: [{x: frameX, y: 180, width: 16, height: 16}],
            duration: 0.1
        },
        // Hopping state (static frame)
        'hopping': {
            frames: [{x: frameX, y: 210, width: 16, height: 16}],
            duration: 0.1
        }
    };
    
    // Red tektites hop slower, blue hop faster
    const jumpDuration = color === 'red' ? 1.0 : 0.5;
    const pauseDuration = color === 'red' ? 0.8 : 0.4;
    const arcHeight = 160; // 2.5 tiles high
    
    const health = 1; // Both colors have 1 heart

    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0), // Not used but needed for some systems
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/enemies.png'),
            60, 330, 16, 16
        ),
        animator: new Animator(tektiteAnimations, 'spawn'),
        collider: new Collider(48, 48, 8, 8),        // 48x48 collision box
        hurtbox: new Collider(48, 48, 8, 8),         // Can be damaged while jumping
        hitbox: new Collider(48, 48, 8, 8),          // Deals contact damage while jumping
        damage: new Damage(1),                       // Deals 0.5 hearts on touch
        hoppingAIMovement: new HoppingAIMovement(jumpDuration, pauseDuration, arcHeight),
        health: new Health(health, health),          // 1 full heart
        enemy: new Enemy(1),                         // Enemy marker
        team: new Team("enemy"),                     // Enemy team
        deathEffect: new DeathEffect('sparkle', 0.4), // Sparkle animation on death
        drops: new Drops('default')                  // What items to drop on death
    };
    
    game.addEntity(entity);
    return entity;
}
