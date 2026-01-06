// Portal initialization - creates connections between maps
// This runs after all maps are loaded to avoid circular reference issues

function initializePortals() {
    OVERWORLD.rooms[7][7].portals = [
        {
            x: 256,
            y: 64,
            width: 64,
            height: 64,
            targetMap: SHOP_7_7,
            targetRoom: {row: 0, col: 0},
            targetPosition: {x: 480, y: 512}
        }
    ];
    
    SHOP_7_7.rooms[0][0].portals = [
        {
            x: 448,
            y: 640,
            width: 128,
            height: 64,
            targetMap: OVERWORLD,
            targetRoom: {row: 7, col: 7},
            targetPosition: {x: 256, y: 128}
        }
    ];
}
