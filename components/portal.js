// Portal component - defines a map transition point
class Portal {
    constructor(targetMap, targetRoom, targetPosition) {
        this.targetMap = targetMap;           // 'OVERWORLD', 'DUNGEON_1', etc.
        this.targetRoom = targetRoom;         // {row, col}
        this.targetPosition = targetPosition; // {x, y}
    }
}
