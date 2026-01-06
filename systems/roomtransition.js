// RoomTransitionSystem - handles room transitions (edge detection + animation)
class RoomTransitionSystem {
    constructor() {
        // Screen boundaries (playable area in translated coordinates)
        this.NORTH_EDGE = 0;     // Top of playable area
        this.SOUTH_EDGE = 640;   // Bottom of playable area
        this.WEST_EDGE = 0;      // Left edge
        this.EAST_EDGE = 960;    // Right edge
    }

    update(deltaTime, game) {
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position) return;
        
        if (player.transition) {
            // Already transitioning - animate it
            this.animateTransition(player, deltaTime);
        } else {
            // Not transitioning - check for edge crossing
            this.checkEdges(player, game);
        }
    }

    checkEdges(player, game) {
        // Check each edge and attempt transition
        if (player.position.y < this.NORTH_EDGE) {
            this.tryTransition(game, player, 'north');
        } else if (player.position.y > this.SOUTH_EDGE) {
            this.tryTransition(game, player, 'south');
        } else if (player.position.x < this.WEST_EDGE) {
            this.tryTransition(game, player, 'west');
        } else if (player.position.x > this.EAST_EDGE) {
            this.tryTransition(game, player, 'east');
        }
    }

    animateTransition(player, deltaTime) {
        // Update timer
        player.transition.timer += deltaTime;
        const progress = Math.min(player.transition.timer / player.transition.duration, 1.0);
        
        // Calculate camera offset based on direction and progress
        const screenWidth = 1024;
        const screenHeight = 704;
        
        switch (player.transition.direction) {
            case 'north':
                // Sliding up: old room slides up, new room slides in from below
                player.transition.cameraOffsetY = Math.floor(screenHeight * progress);
                player.transition.cameraOffsetX = 0;
                break;
            case 'south':
                // Sliding down: old room slides down, new room slides in from above
                player.transition.cameraOffsetY = -Math.floor(screenHeight * progress);
                player.transition.cameraOffsetX = 0;
                break;
            case 'west':
                // Sliding left: old room slides left, new room slides in from right
                player.transition.cameraOffsetX = Math.floor(screenWidth * progress);
                player.transition.cameraOffsetY = 0;
                break;
            case 'east':
                // Sliding right: old room slides right, new room slides in from left
                player.transition.cameraOffsetX = -Math.floor(screenWidth * progress);
                player.transition.cameraOffsetY = 0;
                break;
        }
        
        // Transition complete - remove component
        if (progress >= 1.0) {
            // Position player at opposite edge (they'll slide with the camera)
            this.repositionPlayer(player, player.transition.direction);
            delete player.transition;
        }
    }

    tryTransition(game, player, direction) {
        // Calculate new room coordinates
        let newRow = game.currentLevel.row;
        let newCol = game.currentLevel.col;

        switch (direction) {
            case 'north':
                newRow = game.currentLevel.row - 1;
                break;
            case 'south':
                newRow = game.currentLevel.row + 1;
                break;
            case 'west':
                newCol = game.currentLevel.col - 1;
                break;
            case 'east':
                newCol = game.currentLevel.col + 1;
                break;
        }

        // Check if new room exists in the current map
        if (this.isValidRoom(game, newRow, newCol)) {
            // Valid room - initiate transition
            this.initiateTransition(game, player, newRow, newCol, direction);
        } else {
            // No room in that direction - clamp player to edge
            this.clampToEdge(player, direction);
        }
    }

    isValidRoom(game, row, col) {
        // Check bounds for current map
        if (!game.currentMap || !game.currentMap.rooms) return false;
        
        const numRows = game.currentMap.rooms.length;
        const numCols = game.currentMap.rooms[0].length;
        
        return row >= 0 && row < numRows && col >= 0 && col < numCols;
    }

    initiateTransition(game, player, newRow, newCol, direction) {
        // Store old room data
        const oldRoom = {
            row: game.currentLevel.row,
            col: game.currentLevel.col,
            tiles: game.currentLevel.tiles
        };
        
        // Store new room data
        const newRoom = {
            row: newRow,
            col: newCol,
            tiles: game.currentMap.rooms[newRow][newCol].tiles
        };
        
        // Mark new room as visited
        game.currentMap.rooms[newRow][newCol].visited = true;

        // Add transition component to player
        player.transition = new Transition(oldRoom, newRoom, direction);
        
        // Clear all entities except player
        game.entities = game.entities.filter(e => e.playercontrolled || e.transition);
        
        // Immediately update current level to new room
        game.currentLevel = {
            row: newRow,
            col: newCol,
            tiles: newRoom.tiles,
            passableTiles: game.currentLevel.passableTiles
        };
        
        // Spawn entities for new room (uses helper function)
        loadRoomEntities(game, newRow, newCol);
    }

    repositionPlayer(player, direction) {
        // Move player to opposite edge of new room
        switch (direction) {
            case 'north':
                player.position.y = this.SOUTH_EDGE;
                break;
            case 'south':
                player.position.y = this.NORTH_EDGE;
                break;
            case 'west':
                player.position.x = this.EAST_EDGE;
                break;
            case 'east':
                player.position.x = this.WEST_EDGE;
                break;
        }
    }

    clampToEdge(player, direction) {
        // No valid room - keep player at edge
        switch (direction) {
            case 'north':
                player.position.y = this.NORTH_EDGE;
                break;
            case 'south':
                player.position.y = this.SOUTH_EDGE;
                break;
            case 'west':
                player.position.x = this.WEST_EDGE;
                break;
            case 'east':
                player.position.x = this.EAST_EDGE;
                break;
        }
    }
}
