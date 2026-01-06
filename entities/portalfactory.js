// Portal entity factory - creates portal transition points
function createPortal(game, portalData) {
    const entity = {
        removeFromWorld: false
    };
    
    // Position from portal data
    entity.position = new Position(portalData.x, portalData.y);
    
    // Collider for detecting when player enters
    entity.collider = new Collider(
        portalData.width || 64,   // Default to 64x64
        portalData.height || 64,
        0,  // No offset
        0
    );
    
    // Portal component with target information
    entity.portal = new Portal(
        portalData.targetMap,
        portalData.targetRoom,
        portalData.targetPosition
    );
    
    game.addEntity(entity);
    return entity;
}
