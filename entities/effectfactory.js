// EffectFactory - creates visual effect entities
const EFFECT_FACTORY = {
    create(game, sourceEntity) {
        const type = sourceEntity.deathEffect.type;
        const duration = sourceEntity.deathEffect.duration;
        
        switch(type) {
            case 'sparkle':
                return this.createSparkle(game, sourceEntity, duration);
            case 'particles':
                return this.createParticles(game, sourceEntity, duration);
            case 'explosion':
                return this.createExplosion(game, sourceEntity, duration);
            default:
                console.warn(`Unknown death effect type: ${type}`);
        }
    },
    
    createSparkle(game, source, duration) {
        // Enemy death sparkle using death_sequence.png
        // Frames are 16x16, spaced 16 pixels apart in a row
        const sparkleAnimations = {
            'sparkle': {
                frames: [
                    { x: 0, y: 0, width: 16, height: 16 },
                    { x: 16, y: 0, width: 16, height: 16 },
                    { x: 32, y: 0, width: 16, height: 16 },
                    { x: 48, y: 0, width: 16, height: 16 }
                ],
                duration: duration / 4  // Divide total duration by frame count
            }
        };
        
        const sparkle = {
            position: new Position(source.position.x, source.position.y),
            sprite: new Sprite(
                ASSET_MANAGER.getAsset('./sprites/death_sequence.png'),
                0, 0, 16, 16
            ),
            animator: new Animator(sparkleAnimations, 'sparkle'),
            lifetime: new Lifetime(duration)
        };
        
        game.addEntity(sparkle);
        return sparkle;
    },
    
    createParticles(game, source, duration) {
        // Sword beam death - spawn 4 diagonal particle beams
        const diagonalSpriteCoords = [
            { x: 111, y: 275, direction: 'NW' },
            { x: 127, y: 275, direction: 'NE' },
            { x: 111, y: 291, direction: 'SW' },
            { x: 127, y: 291, direction: 'SE' }
        ];
        
        const particleSpeed = 240; // pixels per second
        const offsetDistance = 0;  // Distance from center to spawn particles
        
        // Spawn 4 particles in diagonal directions
        const particles = [];
        
        diagonalSpriteCoords.forEach((coords, index) => {
            let velocityX, velocityY, offsetX, offsetY;
            
            switch(coords.direction) {
                case 'NE':
                    velocityX = particleSpeed;
                    velocityY = -particleSpeed;
                    offsetX = offsetDistance;
                    offsetY = -offsetDistance;
                    break;
                case 'SE':
                    velocityX = particleSpeed;
                    velocityY = particleSpeed;
                    offsetX = offsetDistance;
                    offsetY = offsetDistance;
                    break;
                case 'SW':
                    velocityX = -particleSpeed;
                    velocityY = particleSpeed;
                    offsetX = -offsetDistance;
                    offsetY = offsetDistance;
                    break;
                case 'NW':
                    velocityX = -particleSpeed;
                    velocityY = -particleSpeed;
                    offsetX = -offsetDistance;
                    offsetY = -offsetDistance;
                    break;
            }
            
            // Animation for particle
            const particleAnimations = {
                'particle': {
                    frames: [
                        { x: coords.x, y: coords.y, width: 16, height: 16 },
                        { x: coords.x + 30, y: coords.y, width: 16, height: 16 },
                        { x: coords.x + 60, y: coords.y, width: 16, height: 16 },
                        { x: coords.x + 90, y: coords.y, width: 16, height: 16 }
                    ],
                    duration: 0.02
                }
            };
            
            const particle = {
                position: new Position(
                    source.position.x + offsetX,
                    source.position.y + offsetY
                ),
                velocity: new Velocity(velocityX, velocityY),
                sprite: new Sprite(
                    ASSET_MANAGER.getAsset('./sprites/link.png'),
                    coords.x, coords.y, 16, 16
                ),
                animator: new Animator(particleAnimations, 'particle'),
                lifetime: new Lifetime(duration)
            };
            
            game.addEntity(particle);
            particles.push(particle);
        });
        
        return particles;
    },
    
    createPoof(game, x, y, duration) {
        // Spawn poof animation using poof.png
        // 3 frames, 16x16, in a row with no padding
        const poofAnimations = {
            'poof': {
                frames: [
                    { x: 0, y: 0, width: 16, height: 16 },
                    { x: 16, y: 0, width: 16, height: 16 },
                    { x: 32, y: 0, width: 16, height: 16 }
                ],
                duration: duration / 3  // Divide total duration by frame count
            }
        };
        
        const poof = {
            position: new Position(x, y),
            sprite: new Sprite(
                ASSET_MANAGER.getAsset('./sprites/poof.png'),
                0, 0, 16, 16
            ),
            animator: new Animator(poofAnimations, 'poof'),
            lifetime: new Lifetime(duration)
        };
        
        game.addEntity(poof);
        return poof;
    },
    
    createExplosion(game, source, duration) {
        // Boss explosion effect - implement when bosses are added
        console.log('Explosion effect not yet implemented');
        return null;
    }
};
