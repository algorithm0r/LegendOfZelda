// Enemy drop tables - defines what items enemies can drop and with what probability
const ENEMY_DROP_TABLES = {
    'default': [
        {type: 'rupee', value: 1, chance: 0.1},   // 30% chance for 1 rupee
        {type: 'rupee', value: 5, chance: 0.1},
        {type: 'heart', value: 2, chance: 0.1},   // 20% chance for 1 heart (2 half-hearts)
        {type: 'bomb', value: 1, chance: 0.1},     // 10% chance for 1 bomb
        {type: 'fairy', value: 0, chance: 0.1}   // 5% chance for fairy (value unused)
    ],
    // 'octorok': [
    //     {type: 'rupee', value: 1, chance: 0.3},   // 30% chance for 1 rupee
    //     {type: 'heart', value: 2, chance: 0.2},   // 20% chance for 1 heart (2 half-hearts)
    //     {type: 'bomb', value: 1, chance: 0.1},    // 10% chance for 1 bomb
    //     {type: 'fairy', value: 0, chance: 0.05}   // 5% chance for fairy (value unused)
    // ],
    
    // 'leever': [
    //     {type: 'rupee', value: 1, chance: 0.25},
    //     {type: 'heart', value: 2, chance: 0.15},
    //     {type: 'bomb', value: 1, chance: 0.15}
    // ],
    
    // More enemy types can be added here:
    // 'stalfos': [...],
    // 'darknut': [...],
    // etc.
};
