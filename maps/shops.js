// Overworld map data - 16 rooms wide x 8 rooms tall (128 total)
// Each room is 16 tiles wide x 11 tiles tall
// Tile guide:
//   2 = tan ground (walkable)
//  61 = green rock, 25 = green tree
//  55 = red rock, 19 = red tree  
//  22 = black cave entrance
//  97 = water

const SHOP_7_7 = {
    // Starting position (Link starts here)
    startRoom: { x: 0, y: 0 },
    startPosition: { x: 512, y: 704 },
    
    // 16 wide x 8 tall grid of rooms
    rooms: [
        [
            // Room [0][0]
            {
                flames: [
                    { x: 288, y: 256 },
                    { x: 672, y: 256 }
                ],
                shopkeeper: { 
                    text: ["IT'S DANGEROUS TO GO", "  ALONE! TAKE THIS."],
                    type: 'man_1' 
                },
                collectibles: [
                    { type: 'sword', data: {tier: 1}, x: 480, y: 352 }
                ],
                tiles: [
                    [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55],
                    [55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55],
                    [55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
                    [55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
                    [55, 55, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 55, 55],
                    [55, 55, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 55, 55],
                    [55, 55, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 55, 55],
                    [55, 55, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 55, 55],
                    [55, 55, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 55, 55],
                    [55, 55, 55, 55, 55, 55, 55, 22, 22, 55, 55, 55, 55, 55, 55, 55],
                    [55, 55, 55, 55, 55, 55, 55, 22, 22, 55, 55, 55, 55, 55, 55, 55]
                ]
            }
        ]
    ]
};
