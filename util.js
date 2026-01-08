/** Global Parameters Object */
const params = { };

/**
 * @param {Number} n
 * @returns Random Integer Between 0 and n-1
 */
const randomInt = n => Math.floor(Math.random() * n);

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @returns String that can be used as a rgb web color
 */
const rgb = (r, g, b) => `rgba(${r}, ${g}, ${b})`;

/**
 * @param {Number} r Red Value
 * @param {Number} g Green Value
 * @param {Number} b Blue Value
 * @param {Number} a Alpha Value
 * @returns String that can be used as a rgba web color
 */
const rgba = (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`;

/**
 * @param {Number} h Hue
 * @param {Number} s Saturation
 * @param {Number} l Lightness
 * @returns String that can be used as a hsl web color
 */
const hsl = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

/** Creates an alias for requestAnimationFrame for backwards compatibility */
window.requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        /**
         * Compatibility for requesting animation frames in older browsers
         * @param {Function} callback Function
         * @param {DOM} element DOM ELEMENT
         */
        ((callback, element) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();

/**
 * Returns distance from two points
 * @param {Number} p1, p2 Two objects with x and y coordinates
 * @returns Distance between the two points
 */
const getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Checks if two axis-aligned bounding boxes (rectangles) overlap
 * @param {Object} rect1 Object with x, y, width, height properties
 * @param {Object} rect2 Object with x, y, width, height properties
 * @returns {Boolean} True if rectangles overlap
 */
const checkAABBCollision = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
};

/**
 * Room loading utility - spawns portals, enemies, collectibles, and other entities for a room
 * @param {Object} game The game engine instance
 * @param {Number} row Room row index
 * @param {Number} col Room column index
 */
function loadRoomEntities(game, row, col) {
    const room = game.currentMap.rooms[row][col];
    
    // Spawn portals
    if (room.portals) {
        for (let portalData of room.portals) {
            createPortal(game, portalData);
        }
    }
    
    // Spawn flames
    if (room.flames) {
        for (let flameData of room.flames) {
            createFlame(game, flameData);
        }
    }

    // Spawn shopkeeper
    if (room.shopkeeper) {
        createShopkeeper(game, room.shopkeeper);
    }
    
    // Spawn collectibles
    if (room.collectibles) {
        for (let collectibleData of room.collectibles) {
            createCollectible(
                game,
                collectibleData.type,
                collectibleData.data,
                collectibleData.x,
                collectibleData.y
            );
        }
    }
}
