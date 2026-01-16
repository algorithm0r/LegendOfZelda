// BurrowAIMovementSystem - controls enemies that emerge from ground/water
class BurrowAIMovementSystem {
    update(deltaTime, game) {
        for (let entity of game.entities) {
            if (entity.burrowAIMovement && entity.position) {
                const burrow = entity.burrowAIMovement;
                
                // Don't process while spawning
                if ((entity.spawnEffect && entity.spawnEffect.spawning) ||
                    (entity.walkIn && entity.walkIn.spawning)) {
                    continue;
                }
                
                // Update state timer
                burrow.timer += deltaTime;
                
                // Handle current state
                switch(burrow.state) {
                    case 'burrowed':
                        this.updateBurrowed(entity, burrow, game, deltaTime);
                        if (burrow.timer >= burrow.burrowedDuration) {
                            this.transitionToEmerging(entity, burrow, game);
                        }
                        break;
                        
                    case 'emerging':
                        if (burrow.timer >= burrow.emergingDuration) {
                            if (burrow.isLeever) {
                                this.transitionToHalfout(entity, burrow);
                            } else {
                                this.transitionToSurfaced(entity, burrow, game);
                            }
                        }
                        break;
                        
                    case 'halfout':
                        // Leever only - starts moving here
                        this.updateLeeverMovement(entity, burrow, deltaTime);
                        if (burrow.timer >= burrow.halfoutDuration) {
                            this.transitionToSurfaced(entity, burrow, game);
                        }
                        break;
                        
                    case 'surfaced':
                        if (burrow.isLeever) {
                            this.updateLeeverMovement(entity, burrow, deltaTime);
                        } else if (burrow.isZora && !burrow.hasShot) {
                            // Zora shoots once when surfaced
                            this.zoraShoot(entity, burrow, game);
                        }
                        
                        if (burrow.timer >= burrow.surfacedDuration) {
                            this.transitionToSubmerging(entity, burrow);
                        }
                        break;
                        
                    case 'submerging':
                        if (burrow.isLeever) {
                            // Leever keeps moving while submerging
                            this.updateLeeverMovement(entity, burrow, deltaTime);
                        }
                        
                        if (burrow.timer >= burrow.submergingDuration) {
                            this.transitionToBurrowed(entity, burrow);
                        }
                        break;
                }
            }
        }
    }
    
    updateBurrowed(entity, burrow, game, deltaTime) {
        // Invisible, no movement
        if (entity.velocity) {
            entity.velocity.dx = 0;
            entity.velocity.dy = 0;
        }
    }
    
    updateLeeverMovement(entity, burrow, deltaTime) {
        // Move toward fixed target
        if (entity.velocity) {
            const dx = burrow.targetX - entity.position.x;
            const dy = burrow.targetY - entity.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                entity.velocity.dx = (dx / distance) * burrow.moveSpeed;
                entity.velocity.dy = (dy / distance) * burrow.moveSpeed;
            }
        }
    }
    
    zoraShoot(entity, burrow, game) {
        // Shoot fireball at Link's current position
        const player = game.entities.find(e => e.playercontrolled);
        if (player && player.position) {
            // Calculate direction to Link
            const dx = player.position.x - entity.position.x;
            const dy = player.position.y - entity.position.y;
            
            PROJECTILE_FACTORY.createZoraFireball(game, entity, dx, dy);
            burrow.hasShot = true;
        }
    }
    
    transitionToEmerging(entity, burrow, game) {
        burrow.state = 'emerging';
        burrow.timer = 0;
        
        // For Leever: lock target to Link's position
        if (burrow.isLeever) {
            const player = game.entities.find(e => e.playercontrolled);
            if (player && player.position) {
                burrow.targetX = player.position.x;
                burrow.targetY = player.position.y;
            }
        }
        
        // For Zora: determine facing direction
        if (burrow.isZora) {
            const player = game.entities.find(e => e.playercontrolled);
            if (player && player.position) {
                const dy = player.position.y - entity.position.y;
                burrow.facingDirection = dy > 0 ? 'down' : 'up';
            }
        }
    }
    
    transitionToHalfout(entity, burrow) {
        burrow.state = 'halfout';
        burrow.timer = 0;
    }
    
    transitionToSurfaced(entity, burrow, game) {
        burrow.state = 'surfaced';
        burrow.timer = 0;
    }
    
    transitionToSubmerging(entity, burrow) {
        burrow.state = 'submerging';
        burrow.timer = 0;
    }
    
    transitionToBurrowed(entity, burrow) {
        burrow.state = 'burrowed';
        burrow.timer = 0;
        burrow.hasShot = false; // Reset for Zora
        
        // Relocate to new position
        this.relocate(entity, burrow);
        
        // Stop movement
        if (entity.velocity) {
            entity.velocity.dx = 0;
            entity.velocity.dy = 0;
        }
    }
    
    relocate(entity, burrow) {
        if (burrow.validSpawnTiles.length === 0) {
            return; // No valid tiles
        }
        
        // Filter out tiles near Link (same logic as ENEMY_FACTORY)
        const game = window.gameEngine; // Access global game engine
        const safeTiles = burrow.validSpawnTiles.filter(tile => {
            return this.isTileAwayFromLink(tile.x, tile.y, game);
        });
        
        // If all tiles are near Link, use any valid tile (shouldn't happen often)
        const tilesToUse = safeTiles.length > 0 ? safeTiles : burrow.validSpawnTiles;
        
        // Pick random tile
        const tile = tilesToUse[Math.floor(Math.random() * tilesToUse.length)];
        
        // Convert to world coordinates (center of tile)
        entity.position.x = tile.x * 64 + 32;
        entity.position.y = tile.y * 64 + 32;
    }
    
    isTileAwayFromLink(tileX, tileY, game) {
        // Find Link
        const player = game.entities.find(e => e.playercontrolled);
        if (!player || !player.position) return true;
        
        // Convert Link's position to tile
        const linkTileX = Math.floor(player.position.x / 64);
        const linkTileY = Math.floor(player.position.y / 64);
        
        // Calculate distance in tiles
        const dx = Math.abs(tileX - linkTileX);
        const dy = Math.abs(tileY - linkTileY);
        
        // Must be more than 2 tiles away (3+ tiles)
        return dx > 2 || dy > 2;
    }
}
