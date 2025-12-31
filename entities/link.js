// Link entity factory - creates the player character
function createLink(game, x, y) {
    const entity = {
        removeFromWorld: false,
        position: new Position(x, y),
        velocity: new Velocity(0, 0),
        playercontrolled: new PlayerControlled(150),  // 150 pixels/second movement speed
        sprite: new Sprite(
            ASSET_MANAGER.getAsset('./sprites/link.png'),
            0,   // frameX - Link facing down at (0, 0)
            0,   // frameY
            16,  // frameWidth
            16   // frameHeight
        )
    };
    
    game.addEntity(entity);
    return entity;
}
