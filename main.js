const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Queue sprite assets for download
ASSET_MANAGER.queueDownload('./sprites/link.png');
ASSET_MANAGER.queueDownload('./sprites/tileset.png');
ASSET_MANAGER.queueDownload('./sprites/items.png');
ASSET_MANAGER.queueDownload('./sprites/UI.png');

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	// Add systems (order matters!)
	gameEngine.addSystem(new PlayerInputSystem());  // Process input first
	gameEngine.addSystem(new MovementSystem());     // Then update positions
	gameEngine.addSystem(new AnimationSystem());    // Then update animations
	gameEngine.addSystem(new RenderSystem());       // Render game world
	gameEngine.addSystem(new UISystem());           // Finally render UI on top

	// Set up level data
	// TODO: Replace tile indices with correct values from tileset.png
	// Tileset has 18 columns, so tile index = (row * 18) + column
	// Example: tile at column 5, row 2 = (2 * 18) + 5 = 41
	gameEngine.currentLevel = {
		// 16 tiles wide, 11 tiles tall
		tiles: [
			[61, 61, 61, 61, 61, 61, 61,  2,  2, 61, 61, 61, 61, 61, 61, 61], // Row 0
			[61, 61, 61, 61, 61, 22, 62,  2,  2, 61, 61, 61, 61, 61, 61, 61], // Row 1
			[61, 61, 61, 62,  2,  2,  2,  2,  2, 61, 61, 61, 61, 61, 61, 61], // Row 2
			[61, 61, 62,  2,  2,  2,  2,  2,  2, 61, 61, 61, 61, 61, 61, 61], // Row 3
			[61, 62,  2,  2,  2,  2,  2,  2,  2, 60, 61, 61, 61, 61, 61, 61], // Row 4
			[ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2], // Row 5
			[61, 61,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 61, 61], // Row 6
			[61, 61,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 61, 61], // Row 7
			[61, 61,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 61, 61], // Row 8
			[61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61], // Row 9
			[61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61, 61]  // Row 10
		],
		
		// TODO: Add tile indices that should block movement (rocks, water, walls, etc.)
		// Currently using 80 as an example solid tile
		solidTiles: [60, 61, 62, 80, 81, 82] // Add more solid tile indices here
	};

	// Create Link at center of screen
	createLink(gameEngine, 500, 500);

	gameEngine.start();
});
