// ProjectileFactory - creates projectile entities
const PROJECTILE_FACTORY = {
    // Create sword beam projectile
    createSwordBeam(game, shooter, x, y, direction) {
        // Determine sprite coordinates and velocity based on direction
        let spriteX, spriteY, velocityX, velocityY;
        const beamSpeed = 480; // pixels per second
        
        switch (direction) {
            case 'up':
                spriteX = 60;
                spriteY = 195;
                velocityX = 0;
                velocityY = -beamSpeed;
                break;
            case 'down':
                spriteX = 0;
                spriteY = 195;
                velocityX = 0;
                velocityY = beamSpeed;
                break;
            case 'left':
                spriteX = 30;
                spriteY = 195;
                velocityX = -beamSpeed;
                velocityY = 0;
                break;
            case 'right':
                spriteX = 90;
                spriteY = 195;
                velocityX = beamSpeed;
                velocityY = 0;
                break;
        }
        
        const linkAnimations = {
            // Walk animations (16x16)
            'walk-down': {
                frames: [
                    { x: 0, y: 195, width: 16, height: 16 },
                    { x: 0, y: 225, width: 16, height: 16 },
                    { x: 0, y: 285, width: 16, height: 16 },
                    { x: 0, y: 255, width: 16, height: 16 }
                ],
                duration: 0.02
            },
            'walk-left': {
                frames: [
                    { x: 30, y: 195, width: 16, height: 16 },
                    { x: 30, y: 225, width: 16, height: 16 },
                    { x: 30, y: 285, width: 16, height: 16 },
                    { x: 30, y: 255, width: 16, height: 16 }
                ],
                duration: 0.02
            },
            'walk-up': {
                frames: [
                    { x: 60, y: 195, width: 16, height: 16 },
                    { x: 60, y: 225, width: 16, height: 16 },
                    { x: 60, y: 285, width: 16, height: 16 },
                    { x: 60, y: 255, width: 16, height: 16 }
                ],
                duration: 0.02
            },
            'walk-right': {
                frames: [
                    { x: 90, y: 195, width: 16, height: 16 },
                    { x: 90, y: 225, width: 16, height: 16 },
                    { x: 90, y: 285, width: 16, height: 16 },
                    { x: 90, y: 255, width: 16, height: 16 }
                ],
                duration: 0.02
            }
        };

        // Create sword beam entity
        const beam = {
            position: new Position(x, y),
            velocity: new Velocity(velocityX, velocityY),
            sprite: new Sprite(
                ASSET_MANAGER.getAsset('./sprites/link.png'),
                spriteX, spriteY, 16, 16
            ),
            animator: new Animator(linkAnimations, 'walk-' + direction),
            hitbox: new Collider(64, 64, 0, 0),  // 64x64 hitbox
            damage: new Damage(1),                // Same damage as sword
            team: new Team("player"),             // Player's projectile
            destroyOnHit: new DestroyOnHit(),     // Destroy when hitting enemy
            deathEffect: new DeathEffect('particles', 0.3) // Diagonal particles on destruction
        };
        
        game.addEntity(beam);
        return beam;
    },
    
    // Create rock projectile (Octorok)
    createRock(game, shooter, direction) {
        // Position rock in front of shooter
        let x = shooter.position.x;
        let y = shooter.position.y;
        let velocityX, velocityY;
        const rockSpeed = 240; // pixels per second (slower than sword beam)
        
        // Offset spawn position based on direction
        switch (direction) {
            case 'up':
                y -= 64;
                velocityX = 0;
                velocityY = -rockSpeed;
                break;
            case 'down':
                y += 64;
                velocityX = 0;
                velocityY = rockSpeed;
                break;
            case 'left':
                x -= 64;
                velocityX = -rockSpeed;
                velocityY = 0;
                break;
            case 'right':
                x += 64;
                velocityX = rockSpeed;
                velocityY = 0;
                break;
        }
        
        const rockSpriteX = 390;
        const rockSpriteY = 225;
        
        // Create rock projectile entity
        const rock = {
            position: new Position(x, y),
            velocity: new Velocity(velocityX, velocityY),
            sprite: new Sprite(
                ASSET_MANAGER.getAsset('./sprites/link.png'),
                rockSpriteX, rockSpriteY, 16, 16
            ),
            hitbox: new Collider(32, 32, 16, 16),  // Smaller hitbox for rock
            damage: new Damage(1),                  // Deals 0.5 hearts
            team: new Team("enemy"),                // Enemy projectile
            destroyOnHit: new DestroyOnHit(),       // Destroy when hitting player
            // Rocks don't need death effect for now - just disappear
        };
        
        game.addEntity(rock);
        return rock;
    },
    
    // Create arrow projectile (Moblin)
    createArrow(game, shooter, direction) {
        // Position arrow in front of shooter
        let x = shooter.position.x;
        let y = shooter.position.y;
        let velocityX, velocityY;
        let spriteX, spriteY;
        const arrowSpeed = 320; // pixels per second (faster than rock)
        
        // Offset spawn position and sprite based on direction
        switch (direction) {
            case 'up':
                y -= 64;
                velocityX = 0;
                velocityY = -arrowSpeed;
                spriteX = 180;
                spriteY = 195;
                break;
            case 'down':
                y += 64;
                velocityX = 0;
                velocityY = arrowSpeed;
                spriteX = 120;
                spriteY = 195;
                break;
            case 'left':
                x -= 64;
                velocityX = -arrowSpeed;
                velocityY = 0;
                spriteX = 150;
                spriteY = 195;
                break;
            case 'right':
                x += 64;
                velocityX = arrowSpeed;
                velocityY = 0;
                spriteX = 210;
                spriteY = 195;
                break;
        }
        
        const team = shooter.team ? shooter.team.team : "enemy";
        // Create arrow projectile entity
        const arrow = {
            position: new Position(x, y),
            velocity: new Velocity(velocityX, velocityY),
            sprite: new Sprite(
                ASSET_MANAGER.getAsset('./sprites/link.png'),
                spriteX, spriteY, 16, 16
            ),
            hitbox: new Collider(32, 32, 16, 16),  // Same hitbox as rock
            damage: new Damage(1),                  // Deals 0.5 hearts
            team: new Team(team),                // Enemy projectile
            destroyOnHit: new DestroyOnHit(),       // Destroy when hitting player
            // Arrows don't need death effect for now - just disappear
        };
        
        game.addEntity(arrow);
        return arrow;
    },
    
    // Add more projectile types here as needed:
    // - createFireball(game, shooter, direction)
    // - createBoomerang(game, shooter, direction) - will need special logic
};
