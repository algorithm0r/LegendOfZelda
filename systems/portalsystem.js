// PortalSystem - handles map transitions when player enters portals
class PortalSystem {
    update(deltaTime, game) {
        // Find player
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position || !player.collider) return;
        
        // Check collision with all portals
        for (let entity of game.entities) {
            if (entity.portal && entity.position && entity.collider) {
                if (this.checkCollision(player, entity)) {
                    this.enterPortal(game, player, entity.portal);
                    break; // Only enter one portal per frame
                }
            }
        }
    }
    
    checkCollision(player, portal) {
        // Calculate player's collision box
        const p1x = player.position.x + player.collider.offsetX;
        const p1y = player.position.y + player.collider.offsetY;
        const p1w = player.collider.width;
        const p1h = player.collider.height;
        
        // Calculate portal's collision box
        const p2x = portal.position.x + portal.collider.offsetX;
        const p2y = portal.position.y + portal.collider.offsetY;
        const p2w = portal.collider.width;
        const p2h = portal.collider.height;
        
        // AABB collision detection
        return p1x < p2x + p2w &&
               p1x + p1w > p2x &&
               p1y < p2y + p2h &&
               p1y + p1h > p2y;
    }
    
    enterPortal(game, player, portal) {
        // Swap to target map (direct object reference)
        game.currentMap = portal.targetMap;
        
        // Clear all entities except player
        game.entities = game.entities.filter(e => e.playercontrolled);
        
        // Load target room
        const targetRow = portal.targetRoom.row;
        const targetCol = portal.targetRoom.col;
        
        game.currentLevel = {
            row: targetRow,
            col: targetCol,
            tiles: game.currentMap.rooms[targetRow][targetCol].tiles,
            passableTiles: game.currentLevel.passableTiles
        };
        
        // Position player at target position
        player.position.x = portal.targetPosition.x;
        player.position.y = portal.targetPosition.y;
        
        // Spawn entities for new room (uses helper function)
        loadRoomEntities(game, targetRow, targetCol);
    }
}
