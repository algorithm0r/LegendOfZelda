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
	gameEngine.addSystem(new RoomTransitionSystem()); // Handle edge detection & transition animation
	gameEngine.addSystem(new AnimationSystem());    // Then update animations
	gameEngine.addSystem(new RenderSystem());       // Render game world
	gameEngine.addSystem(new UISystem());           // Finally render UI on top

	// Set up current map (overworld for now, dungeons later)
	gameEngine.currentMap = OVERWORLD;
	const row = 7;
	const col = 7;
	gameEngine.currentLevel = {
		// 16 tiles wide, 11 tiles tall
		row: row,
		col: col,
		tiles: OVERWORLD.rooms[row][col].tiles,
		
		passableTiles: [2, 22]
	};

	// Create Link at center of screen
	createLink(gameEngine, 500, 500);

	gameEngine.start();
});
