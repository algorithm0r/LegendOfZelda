const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// Queue sprite assets for download
ASSET_MANAGER.queueDownload('./sprites/link.png');
ASSET_MANAGER.queueDownload('./sprites/tileset.png');
ASSET_MANAGER.queueDownload('./sprites/enemies.png');
ASSET_MANAGER.queueDownload('./sprites/misc.png');
ASSET_MANAGER.queueDownload('./sprites/items.png');
ASSET_MANAGER.queueDownload('./sprites/UI.png');

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	// Add systems (order matters!)
	gameEngine.addSystem(new PlayerInputSystem());       // Process input first
	gameEngine.addSystem(new RandomMovementSystem());    // Process enemy AI
	gameEngine.addSystem(new AttackSystem());            // Handle attacks and spawn hitboxes
	gameEngine.addSystem(new KnockbackSystem());         // Apply knockback velocity
	gameEngine.addSystem(new MovementSystem());          // Then update positions
	gameEngine.addSystem(new CombatSystem());            // Check hitbox vs hurtbox collisions
	gameEngine.addSystem(new InvincibilitySystem());     // Update invincibility timers
	gameEngine.addSystem(new PortalSystem());            // Check for portal entry
	gameEngine.addSystem(new RoomTransitionSystem());    // Handle room transitions
	gameEngine.addSystem(new Pickup());                  // Check for item pickups
	gameEngine.addSystem(new PickupAnimationSystem());   // Handle pickup animations
	gameEngine.addSystem(new AnimationSystem());         // Update animations
	gameEngine.addSystem(new ExpirationSystem());       // Remove expired entities
	gameEngine.addSystem(new RenderSystem());            // Render game world
	gameEngine.addSystem(new UISystem());                // Finally render UI on top

	// Initialize portal connections between maps
	initializePortals();

	// Set up current map (overworld for now, dungeons later)
	gameEngine.currentMap = OVERWORLD;
	const row = 7;
	const col = 7;
	gameEngine.currentMap.rooms[row][col].visited = true;
	gameEngine.currentLevel = {
		// 16 tiles wide, 11 tiles tall
		row: row,
		col: col,
		tiles: OVERWORLD.rooms[row][col].tiles,
		
		passableTiles: [2, 22]
	};

	// Create Link at center of screen
	createLink(gameEngine, 500, 500);
	
	// TEST: Spawn some Octoroks
	createOctorok(gameEngine, 200, 200);
	createOctorok(gameEngine, 700, 400);
	
	// Load portals and enemies for starting room
	loadRoomEntities(gameEngine, row, col);

	gameEngine.start();
});
