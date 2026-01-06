// Shopkeeper entity factory - creates a shopkeeper entity at specified position
function createShopkeeper(game, shopkeeperData) {
    const entity = {
        removeFromWorld: false
    };
    
    // Position from shopkeeper data
    entity.position = new Position(480, 256);
    
    let sx = 0;
    if(shopkeeperData.type === 'man_2') {
        sx = 30;                            
    }
    if(shopkeeperData.type === 'woman') {
        sx = 60;                            
    }
    // sprite component for shopkeeper visuals
    entity.sprite = new Sprite(
        ASSET_MANAGER.getAsset('./sprites/misc.png'),
        sx, 5,
        16, 16);
   
    // text component for shopkeeper dialogue
    entity.text = new Text(shopkeeperData.text);

    game.addEntity(entity);
    return entity;
}
