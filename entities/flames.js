// Flame entity factory - creates a flame entity at specified position
function createFlame(game, flameData) {
    const entity = {
        removeFromWorld: false
    };
    
    // Position from portal data
    entity.position = new Position(flameData.x, flameData.y);
    
    // sprite component for flame visuals
    entity.sprite = new Sprite(
        ASSET_MANAGER.getAsset('./sprites/enemies.png'),
        300, 0,
        16, 16);

    // animations for flame entity
    const animations = {
        'flame': {
            frames: [
                {x: 300, y: 0},
                {x: 300, y: 30}
            ],
            duration: 0.1
        }
    };

    // animator component for flame animation
    entity.animator = new Animator(animations, 'flame');
    
    game.addEntity(entity);
    return entity;
}
