window.GCFC_CONFIG = {
  WORLD_W: 960,
  WORLD_H: 540,
  GROUND_Y: 540 - 85,
  CEILING_Y: 75,

  GRAVITY: 2150,
  JUMP_IMPULSE: -680,
  DOUBLE_JUMP_IMPULSE: -590,
  MAX_FALL_SPEED: 940,
  MOVE_SPEED: 330,
  PLAYER_MIN_X: 50,
  PLAYER_MAX_X: 580,
  PLAYER_W: 76,
  PLAYER_H: 68,

  BASE_SCROLL_SPEED: 280,
  MAX_SCROLL_SPEED: 650,
  SPEED_RAMP_RATE: 2.9,
  NEAR_MISS_GAP: 32,
  NEAR_MISS_SLOWMO_DURATION: 0.35,
  NEAR_MISS_TIMESCALE: 0.35,

  COYOTE_TIME: 0.08,
  JUMP_BUFFER: 0.14,

  COMBO_TIERS: [
    { streak: 30, mult: 5 },
    { streak: 20, mult: 4 },
    { streak: 12, mult: 3 },
    { streak: 5, mult: 2 },
    { streak: 0, mult: 1 },
  ],
};
