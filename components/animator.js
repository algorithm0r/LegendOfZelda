// Animator component - stores animation data and tracks current animation state
class Animator {
    constructor(animations, startAnimation = 'idle-down') {
        this.animations = animations;          // Map of animation name -> {frames, duration}
        this.currentAnimation = startAnimation; // Current animation name
        this.currentFrame = 0;                 // Current frame index
        this.frameTimer = 0;                   // Time accumulator for frame advancement
    }
}
