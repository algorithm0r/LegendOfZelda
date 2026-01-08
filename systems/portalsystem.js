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
        const playerBox = {
            x: player.position.x + player.collider.offsetX,
            y: player.position.y + player.collider.offsetY,
            width: player.collider.width,
            height: player.collider.height
        };
        
        // Calculate portal's collision box
        const portalBox = {
            x: portal.position.x + portal.collider.offsetX,
            y: portal.position.y + portal.collider.offsetY,
            width: portal.collider.width,
            height: portal.collider.height
        };
        
        return checkAABBCollision(playerBox, portalBox);
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
