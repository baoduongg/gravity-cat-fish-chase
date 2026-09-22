# Gravity Cat: Fish Chase — Phaser 3 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite "Gravity Cat: Fish Chase" from vanilla JS + hand-rolled Canvas 2D into a Phaser 3 game (CDN, no build step), preserving all existing gameplay features, difficulty tuning, persistence, and visual style, with visuals/audio generated procedurally at runtime (ported from the existing game.js vector-draw and Web Audio synth code) since no image/audio generation tool is available in this environment.

**Architecture:** A `BootScene` procedurally generates all textures (via `Phaser.GameObjects.Graphics` + `generateTexture()`, ported from `game.js`'s existing draw functions) and initializes audio, then `HomeScene` → `PlayScene` (Arcade Physics platformer with in-scene HUD) → `GameOverScene`, with `PauseScene`, `ShopScene`, `LeaderboardScene`, `SettingsScene` as additional scenes. Mobile D-pad/Jump stay as DOM buttons overlaid on the canvas. Persistence keeps today's exact `localStorage` keys.

**Tech Stack:** Phaser 3 (CDN `<script>`, no bundler), Arcade Physics, `Phaser.GameObjects.Graphics`-generated textures, a small custom `AudioContext`-based synth module (ported from `game.js`), plain ES6 script files loaded via `<script>` tags in dependency order.

**Spec:** [docs/superpowers/specs/2026-09-22-phaser-migration-design.md](../specs/2026-09-22-phaser-migration-design.md) (see "Amendment" section — the original spec called for sourced PNG/audio assets; this was revised after discovering no such tool exists in this environment)

## Global Constraints

- No build step: Phaser loaded via CDN `<script>` tag, all other JS as plain `<script src>` files loaded in dependency order. No npm/webpack/Vite.
- World size: 960×540. `GROUND_Y = WORLD_H - 85` (455). `CEILING_Y = 75`.
- Physics constants (unchanged from current game): `GRAVITY = 2150`, `JUMP_IMPULSE = -680`, `DOUBLE_JUMP_IMPULSE = -590`, `MAX_FALL_SPEED = 940`, `MOVE_SPEED = 330`, `PLAYER_MIN_X = 50`, `PLAYER_MAX_X = 580`, `PLAYER_W = 76`, `PLAYER_H = 68`.
- Scroll/difficulty: `BASE_SCROLL_SPEED = 280`, `MAX_SCROLL_SPEED = 650`, `SPEED_RAMP_RATE = 2.9` px/s per second survived.
- `NEAR_MISS_GAP = 32`. Near-miss triggers 0.35s slow-motion (`this.time.timeScale` / `this.physics.world.timeScale` ≈ 0.35).
- Coyote time = 0.08s. Jump buffer = 0.14s.
- Combo tiers by streak: ≥30→x5, ≥20→x4, ≥12→x3, ≥5→x2, else x1.
- `localStorage` keys are frozen and MUST NOT change: `gcfc_best`, `gcfc_totalFish`, `gcfc_unlockedSkins`, `gcfc_unlockedTrails`, `gcfc_currentSkin`, `gcfc_currentTrail`, `gcfc_highScores`, `gcfc_bgm_vol`, `gcfc_sfx_vol`, `gcfc_bgm_on`, `gcfc_sfx_on`, `gcfc_shake_on`, `gcfc_reduce_motion`.
- Skins (id, name, unlock price, colors): orange/0/`#ff9d42`+`#ff7043`, black/30/`#3d3b4f`+`#ff6b8b`, calico/60/`#f7ebd2`+`#d9742b`(+spot `#333333`), royal/100/`#ffe066`+`#f59f00`(+crown), bread/140/`#d4a373`+`#bc6c25`(+bread costume), space/200/`#64b5f6`+`#1976d2`(+helmet).
- Trails (id, name, unlock price): wind/0, rainbow/40, bubble/80, heart/120, star/160, sakura/220.
- All textures are generated procedurally at runtime in `BootScene` via `Phaser.GameObjects.Graphics` + `generateTexture()` — no PNG files are loaded. No image-generation tool is available in this environment (verified during setup); ported from `game.js`'s existing `drawPlayerCat`/`drawObstacle`/`drawCollectible`/`drawPlatform`/`drawHeart`/`drawStar` functions.
- All audio is generated procedurally via `AudioContext` oscillators — no MP3 files are loaded. Ported from `game.js`'s existing `playTone`/`playJumpSound`/`playFishSound`/`playNearMissSound`/`playHitSound`/BGM-interval functions.
- Reference images for target layout/style (for scene composition decisions, not asset sourcing): `game-home.png`, `game-play.png`, `game-over.png`.

---

### Task 1: Project scaffold, config/catalog/storage, and BootScene with generated textures

**Files:**
- Create: `src/config.js`
- Create: `src/catalog.js`
- Create: `src/storage.js`
- Create: `src/textures.js`
- Create: `src/scenes/BootScene.js`
- Modify: `index.html`

**Interfaces:**
- Produces: global `window.GCFC_CONFIG` object (all physics/world constants), `window.GCFC_CATALOG.SKINS` / `window.GCFC_CATALOG.TRAILS` arrays (each skin entry includes `color`/`earColor`/`spotColor`/`hasCrown`/`isBread`/`isSpace` metadata), `window.GCFCStorage` object with methods `load()` → state object, `save(state)`, and default state shape `{ bestScore, totalFish, unlockedSkins, unlockedTrails, currentSkin, currentTrail, highScoresList, bgmVolume, sfxVolume, bgmEnabled, sfxEnabled, shakeEnabled, reduceMotion }`. `window.GCFCTextures.generateAll(scene)` function that draws every texture into the given scene's texture manager. `BootScene` (key `"Boot"`) calls `generateAll`, then starts `"Home"`.

- [ ] **Step 1: Write `src/config.js`**

```javascript
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
```

- [ ] **Step 2: Write `src/catalog.js`**

```javascript
window.GCFC_CATALOG = {
  SKINS: [
    { id: "orange", name: "Mèo Cam Béo", price: 0, color: 0xff9d42, earColor: 0xff7043 },
    { id: "black", name: "Mèo Đen Ninja", price: 30, color: 0x3d3b4f, earColor: 0xff6b8b },
    { id: "calico", name: "Mèo Tam Thể", price: 60, color: 0xf7ebd2, earColor: 0xd9742b, spotColor: 0x333333 },
    { id: "royal", name: "Mèo Hoàng Gia", price: 100, color: 0xffe066, earColor: 0xf59f00, hasCrown: true },
    { id: "bread", name: "Mèo Bánh Mì", price: 140, color: 0xd4a373, earColor: 0xbc6c25, isBread: true },
    { id: "space", name: "Mèo Phi Hành", price: 200, color: 0x64b5f6, earColor: 0x1976d2, isSpace: true },
  ],
  TRAILS: [
    { id: "wind", name: "Gió Thoảng", price: 0, color: 0xffffff },
    { id: "rainbow", name: "Cầu Vồng", price: 40, color: 0xff6b8b },
    { id: "bubble", name: "Bong Bóng", price: 80, color: 0xa8e6ff },
    { id: "heart", name: "Trái Tim", price: 120, color: 0xff6b8b },
    { id: "star", name: "Ngôi Sao", price: 160, color: 0xffd166 },
    { id: "sakura", name: "Hoa Anh Đào", price: 220, color: 0xffb3d9 },
  ],
};
```

- [ ] **Step 3: Write `src/storage.js`**

```javascript
window.GCFCStorage = (() => {
  const DEFAULT_HIGH_SCORES = [];

  const getNumber = (k, def = 0) => Number(localStorage.getItem(k) || def);
  const getJSON = (k, def) => {
    try {
      const v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? def : v;
    } catch (e) {
      return def;
    }
  };

  function load() {
    return {
      bestScore: getNumber("gcfc_best", 0),
      totalFish: getNumber("gcfc_totalFish", 0),
      unlockedSkins: getJSON("gcfc_unlockedSkins", ["orange"]),
      unlockedTrails: getJSON("gcfc_unlockedTrails", ["wind"]),
      currentSkin: localStorage.getItem("gcfc_currentSkin") || "orange",
      currentTrail: localStorage.getItem("gcfc_currentTrail") || "wind",
      highScoresList: getJSON("gcfc_highScores", DEFAULT_HIGH_SCORES),
      bgmVolume: getNumber("gcfc_bgm_vol", 70) / 100,
      sfxVolume: getNumber("gcfc_sfx_vol", 85) / 100,
      bgmEnabled: localStorage.getItem("gcfc_bgm_on") !== "false",
      sfxEnabled: localStorage.getItem("gcfc_sfx_on") !== "false",
      shakeEnabled: localStorage.getItem("gcfc_shake_on") !== "false",
      reduceMotion: localStorage.getItem("gcfc_reduce_motion") === "true",
    };
  }

  function save(state) {
    localStorage.setItem("gcfc_best", String(state.bestScore));
    localStorage.setItem("gcfc_totalFish", String(state.totalFish));
    localStorage.setItem("gcfc_unlockedSkins", JSON.stringify(state.unlockedSkins));
    localStorage.setItem("gcfc_unlockedTrails", JSON.stringify(state.unlockedTrails));
    localStorage.setItem("gcfc_currentSkin", state.currentSkin);
    localStorage.setItem("gcfc_currentTrail", state.currentTrail);
    localStorage.setItem("gcfc_highScores", JSON.stringify(state.highScoresList));
    localStorage.setItem("gcfc_bgm_vol", String(Math.round(state.bgmVolume * 100)));
    localStorage.setItem("gcfc_sfx_vol", String(Math.round(state.sfxVolume * 100)));
    localStorage.setItem("gcfc_bgm_on", String(state.bgmEnabled));
    localStorage.setItem("gcfc_sfx_on", String(state.sfxEnabled));
    localStorage.setItem("gcfc_shake_on", String(state.shakeEnabled));
    localStorage.setItem("gcfc_reduce_motion", String(state.reduceMotion));
  }

  return { load, save };
})();
```

- [ ] **Step 4: Write `src/textures.js`**

This module draws every texture the game needs using `Phaser.GameObjects.Graphics`, ported from `game.js`'s existing vector-draw functions (`drawPlayerCat`, `drawObstacle`, `drawCollectible`, `drawPlatform`, `drawHeart`, `drawStar`), then bakes each into a named texture via `generateTexture()`. All player-pose drawing goes through one parameterized function so the 6 skins × 6 poses (idle, run-1, run-2, jump, fall, hurt) share one code path.

```javascript
window.GCFCTextures = (() => {
  function drawCatPose(g, skin, pose) {
    g.clear();
    const bodyColor = skin.color;
    const earColor = skin.earColor;
    const cx = 64, cy = 70;

    const legOffset = pose === "run-1" ? 6 : pose === "run-2" ? -6 : 0;
    const jumpStretch = pose === "jump" ? -4 : pose === "fall" ? 4 : 0;
    const tailCurl = pose === "hurt" ? 2 : -22;

    // Tail
    g.lineStyle(10, bodyColor, 1);
    g.beginPath();
    g.moveTo(cx - 18, cy + 4);
    g.lineTo(cx - 26, cy + tailCurl);
    g.strokePath();

    // Back legs
    g.fillStyle(earColor, 1);
    g.fillEllipse(cx - 14 - legOffset, cy + 24, 14, 18);
    g.fillEllipse(cx + 14 + legOffset, cy + 24, 14, 18);

    // Body
    g.fillStyle(bodyColor, 1);
    g.fillEllipse(cx, cy + 4 + jumpStretch, 52, 44);

    // Calico spot
    if (skin.spotColor) {
      g.fillStyle(skin.spotColor, 1);
      g.fillEllipse(cx + 8, cy - 2, 16, 20);
    }

    // Bread costume
    if (skin.isBread) {
      g.fillStyle(0xffe8d6, 1);
      g.lineStyle(3, 0xbc6c25, 1);
      g.fillRoundedRect(cx - 22, cy - 16, 44, 40, 8);
      g.strokeRoundedRect(cx - 22, cy - 16, 44, 40, 8);
    }

    // Head
    g.fillStyle(bodyColor, 1);
    g.fillCircle(cx + 8, cy - 12, 19);

    // Ears
    g.fillStyle(earColor, 1);
    g.fillTriangle(cx - 2, cy - 24, cx + 4, cy - 36, cx + 10, cy - 26);
    g.fillTriangle(cx + 12, cy - 26, cx + 18, cy - 36, cx + 24, cy - 22);

    // Crown (royal)
    if (skin.hasCrown) {
      g.fillStyle(0xffd166, 1);
      g.lineStyle(2, 0xe09f3e, 1);
      g.beginPath();
      g.moveTo(cx + 4, cy - 30);
      g.lineTo(cx + 4, cy - 40);
      g.lineTo(cx + 11, cy - 34);
      g.lineTo(cx + 18, cy - 40);
      g.lineTo(cx + 18, cy - 30);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    // Space helmet (round outline over head)
    if (skin.isSpace) {
      g.lineStyle(3, 0xdfefff, 0.9);
      g.strokeCircle(cx + 8, cy - 12, 24);
    }

    // Eyes
    g.fillStyle(0x1a1a1a, 1);
    const eyeY = pose === "hurt" ? cy - 8 : cy - 14;
    g.fillCircle(cx + 2, eyeY, 3);
    g.fillCircle(cx + 14, eyeY, 3);
  }

  function drawFish(g) {
    g.clear();
    g.fillStyle(0xffb347, 1);
    g.fillEllipse(32, 32, 34, 20);
    g.fillTriangle(6, 32, -6, 20, -6, 44);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(44, 28, 3);
  }

  function drawPaw(g) {
    g.clear();
    g.fillStyle(0xffb3d9, 1);
    g.fillEllipse(32, 38, 20, 16);
    g.fillCircle(18, 20, 7);
    g.fillCircle(30, 14, 7);
    g.fillCircle(42, 20, 7);
  }

  function drawObstacleFishbone(g) {
    g.clear();
    g.lineStyle(8, 0xf1e9db, 1);
    g.beginPath();
    g.moveTo(4, 32);
    g.lineTo(60, 32);
    g.strokePath();
    g.lineStyle(4, 0xf1e9db, 1);
    for (let i = 0; i < 5; i++) {
      g.beginPath();
      g.moveTo(16 + i * 8, 22);
      g.lineTo(16 + i * 8, 42);
      g.strokePath();
    }
  }

  function drawObstacleCactus(g) {
    g.clear();
    g.fillStyle(0x8fbc6b, 1);
    g.fillRoundedRect(20, 8, 16, 50, 6);
    g.fillRoundedRect(6, 24, 14, 24, 5);
    g.fillRoundedRect(44, 20, 14, 30, 5);
  }

  function drawObstacleBird(g) {
    g.clear();
    g.fillStyle(0x7fc8e8, 1);
    g.fillEllipse(32, 32, 26, 18);
    g.fillTriangle(10, 32, -8, 16, -8, 32);
    g.fillTriangle(10, 32, -8, 48, -8, 32);
    g.fillStyle(0xf4a259, 1);
    g.fillTriangle(52, 30, 62, 32, 52, 36);
  }

  function drawObstacleYarn(g) {
    g.clear();
    g.fillStyle(0xe066a6, 1);
    g.fillCircle(32, 32, 26);
    g.lineStyle(2, 0xc94f8e, 0.8);
    for (let i = 0; i < 5; i++) {
      g.strokeCircle(32, 32, 8 + i * 4);
    }
  }

  function drawPlatform(g) {
    g.clear();
    g.fillStyle(0xc9a066, 1);
    g.fillRoundedRect(0, 20, 128, 20, 8);
    g.fillStyle(0x9ccc65, 1);
    g.fillRoundedRect(0, 12, 128, 12, 6);
  }

  function drawHeart(g, color) {
    g.clear();
    g.fillStyle(color, 1);
    g.beginPath();
    g.moveTo(16, 8);
    g.arc(9, 9, 7, Math.PI, 0, false);
    g.arc(23, 9, 7, Math.PI, 0, false);
    g.lineTo(16, 28);
    g.closePath();
    g.fillPath();
  }

  function drawStar(g, color) {
    g.clear();
    g.fillStyle(color, 1);
    const cx = 16, cy = 16, spikes = 4, outerR = 15, innerR = 6;
    g.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (Math.PI / spikes) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.closePath();
    g.fillPath();
  }

  function drawTrailParticle(g, trailId, color) {
    g.clear();
    if (trailId === "heart") return drawHeart(g, color);
    if (trailId === "star" || trailId === "sakura") return drawStar(g, color);
    if (trailId === "bubble") {
      g.lineStyle(2, color, 0.9);
      g.strokeCircle(16, 16, 12);
      return;
    }
    // wind, rainbow: soft streak
    g.fillStyle(color, 0.8);
    g.fillEllipse(16, 16, 24, 8);
  }

  function drawUiButton(g, color) {
    g.clear();
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, 160, 60, 16);
    g.lineStyle(3, 0x00000022, 1);
    g.strokeRoundedRect(0, 0, 160, 60, 16);
  }

  function drawUiBoard(g, color, w, h) {
    g.clear();
    g.fillStyle(color, 1);
    g.fillRoundedRect(0, 0, w, h, 24);
    g.lineStyle(4, 0xffffff55, 1);
    g.strokeRoundedRect(0, 0, w, h, 24);
  }

  function generateAll(scene) {
    const g = scene.add.graphics();

    window.GCFC_CATALOG.SKINS.forEach((skin) => {
      ["idle", "run-1", "run-2", "jump", "fall", "hurt"].forEach((pose) => {
        drawCatPose(g, skin, pose);
        g.generateTexture(`cat-${skin.id}-${pose}`, 128, 140);
      });
    });

    drawFish(g);
    g.generateTexture("fish", 64, 64);
    drawPaw(g);
    g.generateTexture("paw", 64, 64);
    drawObstacleFishbone(g);
    g.generateTexture("obstacle-fishbone", 64, 64);
    drawObstacleCactus(g);
    g.generateTexture("obstacle-cactus", 64, 64);
    drawObstacleBird(g);
    g.generateTexture("obstacle-bird", 64, 64);
    drawObstacleYarn(g);
    g.generateTexture("obstacle-yarn", 64, 64);
    drawPlatform(g);
    g.generateTexture("platform", 128, 40);

    window.GCFC_CATALOG.TRAILS.forEach((trail) => {
      drawTrailParticle(g, trail.id, trail.color);
      g.generateTexture(`trail-${trail.id}`, 32, 32);
    });

    const buttonColors = {
      play: 0x6fcf97, retry: 0xf2994a, home: 0x56ccf2, shop: 0xff8fb1,
      leaderboard: 0xf2c94c, settings: 0xbdbdbd, share: 0xbb6bd9, close: 0xeb5757,
    };
    Object.keys(buttonColors).forEach((key) => {
      drawUiButton(g, buttonColors[key]);
      g.generateTexture(`ui-btn-${key}`, 160, 60);
    });

    drawUiBoard(g, 0xfff3e0, 480, 360);
    g.generateTexture("ui-board-gameover", 480, 360);
    drawUiBoard(g, 0xffe0ec, 480, 360);
    g.generateTexture("ui-board-highscore", 480, 360);
    drawUiBoard(g, 0xd4a373, 160, 80);
    g.generateTexture("ui-plaque-wood", 160, 80);

    g.destroy();
  }

  return { generateAll };
})();
```

- [ ] **Step 5: Write `src/scenes/BootScene.js`**

```javascript
class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    window.GCFCTextures.generateAll(this);
    this.scene.start("Home");
  }
}
```

- [ ] **Step 6: Wire up `index.html`**

Replace the `<script src="game.js">` reference (and any inline game-state script) with the Phaser CDN tag plus script tags for every file in dependency order, ending with a scene launcher. Let Phaser create its own canvas into `<div id="game-container">` (use `parent: "game-container"` in the config below) and remove the manual `<canvas id="game-canvas">` tag. Keep the mobile D-pad/Jump DOM buttons and `#top-controls` settings button as-is; remove the `#screen-*` overlay divs (start/gameover/pause/leaderboard/settings/shop) and the `#hud` div since those become Phaser scenes/in-scene HUD.

Add near the end of `<body>`, after the game-container and mobile control markup:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"></script>
<script src="src/config.js"></script>
<script src="src/catalog.js"></script>
<script src="src/storage.js"></script>
<script src="src/textures.js"></script>
<script src="src/audio.js"></script>
<script src="src/scenes/BootScene.js"></script>
<script src="src/scenes/HomeScene.js"></script>
<script src="src/scenes/PlayScene.js"></script>
<script src="src/scenes/PauseScene.js"></script>
<script src="src/scenes/GameOverScene.js"></script>
<script src="src/scenes/ShopScene.js"></script>
<script src="src/scenes/LeaderboardScene.js"></script>
<script src="src/scenes/SettingsScene.js"></script>
<script>
  new Phaser.Game({
    type: Phaser.AUTO,
    width: window.GCFC_CONFIG.WORLD_W,
    height: window.GCFC_CONFIG.WORLD_H,
    parent: "game-container",
    backgroundColor: "#bfe6ff",
    physics: {
      default: "arcade",
      arcade: { gravity: { y: 0 }, debug: false },
    },
    scene: [BootScene, HomeScene, PlayScene, PauseScene, GameOverScene, ShopScene, LeaderboardScene, SettingsScene],
  });
</script>
```

Note: `src/audio.js` is referenced here but written in Task 9 — until Task 9 lands, comment out or omit that one `<script>` line (it will 404 harmlessly if left in, since it's loaded after the scene classes that don't yet call into it; but for a clean intermediate state, omit the line now and add it back in Task 9). Global gravity is left at 0 and applied manually per-frame in `PlayScene` to match the current hand-tuned feel exactly, rather than relying on Arcade's built-in gravity tick — finalized in Task 3.

- [ ] **Step 7: Manually verify boot**

Run: `python3 -m http.server 8000` from the project root, then open `http://localhost:8000` in a browser.
Expected: no console errors about missing scenes or `GCFCTextures`; the page may go to a blank canvas since `HomeScene` isn't implemented yet — that's expected until Task 2. Open devtools console and run `window.GCFCTextures` — expect it to be defined.

- [ ] **Step 8: Commit**

```bash
git add src/config.js src/catalog.js src/storage.js src/textures.js src/scenes/BootScene.js index.html
git commit -m "Scaffold Phaser project: config, catalog, storage, generated textures, BootScene"
```

---

### Task 2: HomeScene

**Files:**
- Create: `src/scenes/HomeScene.js`

**Interfaces:**
- Consumes: `window.GCFC_CONFIG`, `window.GCFCStorage.load()`, texture keys `ui-btn-play`, `ui-btn-shop`, `ui-btn-leaderboard`, `ui-btn-settings`, `cat-{currentSkin}-idle`.
- Produces: Scene key `"Home"`. Navigates to `"Play"`, `"Shop"`, `"Leaderboard"`, `"Settings"` on respective button clicks.

- [ ] **Step 1: Write `src/scenes/HomeScene.js`**

```javascript
class HomeScene extends Phaser.Scene {
  constructor() {
    super("Home");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const state = window.GCFCStorage.load();
    const cx = cfg.WORLD_W / 2;

    this.add.rectangle(cx, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0xbfe6ff);

    this.add.text(cx, 90, "GRAVITY CAT: FISH CHASE", {
      fontFamily: "Baloo 2, sans-serif",
      fontSize: "38px",
      color: "#3d3b4f",
      fontStyle: "800",
    }).setOrigin(0.5);

    this.add.image(cx, 230, `cat-${state.currentSkin}-idle`).setScale(1.4);

    this.add.text(cx, 300, `BEST: ${state.bestScore.toLocaleString()}`, {
      fontFamily: "Baloo 2, sans-serif",
      fontSize: "20px",
      color: "#3d3b4f",
    }).setOrigin(0.5);

    const playBtn = this.add.image(cx, 380, "ui-btn-play").setInteractive({ useHandCursor: true });
    this.add.text(cx, 380, "PLAY", { fontFamily: "Baloo 2, sans-serif", fontSize: "18px", color: "#ffffff", fontStyle: "700" }).setOrigin(0.5);
    playBtn.on("pointerup", () => this.scene.start("Play"));

    const shopBtn = this.add.image(cx - 110, 460, "ui-btn-shop").setScale(0.7).setInteractive({ useHandCursor: true });
    shopBtn.on("pointerup", () => this.scene.start("Shop"));

    const boardBtn = this.add.image(cx, 460, "ui-btn-leaderboard").setScale(0.7).setInteractive({ useHandCursor: true });
    boardBtn.on("pointerup", () => this.scene.start("Leaderboard"));

    const settingsBtn = this.add.image(cx + 110, 460, "ui-btn-settings").setScale(0.7).setInteractive({ useHandCursor: true });
    settingsBtn.on("pointerup", () => this.scene.start("Settings"));
  }
}
```

- [ ] **Step 2: Manually verify**

Serve the project (`python3 -m http.server 8000`) and open in a browser.
Expected: Home screen renders with title, idle cat texture (drawn shape, not a photo-realistic sprite — this is expected given the procedural-texture approach), best score text, and four clickable buttons (verified visually against `game-home.png` for rough layout parity — exact pixel match not required at this step, since visuals are now generated shapes, not the hand-authored art `game-home.png` depicts).

- [ ] **Step 3: Commit**

```bash
git add src/scenes/HomeScene.js
git commit -m "Add HomeScene"
```

---

### Task 3: PlayScene — player physics and controls

**Files:**
- Create: `src/scenes/PlayScene.js`

**Interfaces:**
- Consumes: `window.GCFC_CONFIG`, `window.GCFCStorage.load()`, texture keys `cat-{skin}-idle/run-1/run-2/jump/fall/hurt`.
- Produces: Scene key `"Play"`. Exposes `this.player` (Arcade sprite with custom `vy`, `jumpsLeft`, `onGround` state tracked in scene-local variables, matching current game's model) for Task 4/5 to extend. Keyboard input via `this.cursors` (arrow keys) and `this.wasd` (WASD keys). Mobile input via DOM buttons with ids `#btn-left`, `#btn-right`, `#btn-jump` (must exist in `index.html`'s retained mobile control markup) dispatching to scene-local `moveLeftHeld` / `moveRightHeld` / `jumpPressed` flags.

- [ ] **Step 1: Write `src/scenes/PlayScene.js` (movement + jump only, no obstacles yet)**

```javascript
class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    this.state = window.GCFCStorage.load();

    this.add.rectangle(cfg.WORLD_W / 2, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0xbfe6ff);
    this.groundLine = this.add.rectangle(cfg.WORLD_W / 2, cfg.GROUND_Y + 40, cfg.WORLD_W, 80, 0x9ccc65);

    this.player = this.physics.add.sprite(200, cfg.GROUND_Y - cfg.PLAYER_H / 2, `cat-${this.state.currentSkin}-idle`);
    this.player.setCollideWorldBounds(false);
    this.player.body.allowGravity = false;
    this.player.vy = 0;
    this.player.onGround = true;
    this.player.jumpsLeft = 2;

    this.coyoteTime = 0;
    this.jumpBuffer = 0;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({ left: "A", right: "D", up: "W" });

    this.moveLeftHeld = false;
    this.moveRightHeld = false;
    this.jumpPressed = false;

    const bindHoldButton = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("pointerdown", (e) => { e.preventDefault(); onDown(); });
      el.addEventListener("pointerup", (e) => { e.preventDefault(); onUp(); });
      el.addEventListener("pointerleave", () => onUp());
    };
    bindHoldButton("btn-left", () => (this.moveLeftHeld = true), () => (this.moveLeftHeld = false));
    bindHoldButton("btn-right", () => (this.moveRightHeld = true), () => (this.moveRightHeld = false));
    bindHoldButton("btn-jump", () => (this.jumpPressed = true), () => {});

    this.input.keyboard.on("keydown-SPACE", () => (this.jumpPressed = true));
    this.input.keyboard.on("keydown-UP", () => (this.jumpPressed = true));
    this.input.keyboard.on("keydown-W", () => (this.jumpPressed = true));
  }

  update(time, delta) {
    const cfg = window.GCFC_CONFIG;
    const dt = delta / 1000;
    const p = this.player;

    const moveLeft = this.cursors.left.isDown || this.wasd.left.isDown || this.moveLeftHeld;
    const moveRight = this.cursors.right.isDown || this.wasd.right.isDown || this.moveRightHeld;

    if (moveLeft && !moveRight) {
      p.x = Math.max(cfg.PLAYER_MIN_X, p.x - cfg.MOVE_SPEED * dt);
      p.setFlipX(true);
    } else if (moveRight && !moveLeft) {
      p.x = Math.min(cfg.PLAYER_MAX_X, p.x + cfg.MOVE_SPEED * dt);
      p.setFlipX(false);
    }

    if (this.jumpBuffer > 0) this.jumpBuffer -= dt;
    if (!p.onGround && this.coyoteTime > 0) this.coyoteTime -= dt;

    if (this.jumpPressed) {
      if (p.onGround || this.coyoteTime > 0) {
        p.vy = cfg.JUMP_IMPULSE;
        p.onGround = false;
        p.jumpsLeft = 1;
        this.coyoteTime = 0;
        if (window.GCFCAudio && this.state.sfxEnabled) window.GCFCAudio.playJump(false, this.state.sfxVolume);
      } else if (p.jumpsLeft > 0) {
        p.vy = cfg.DOUBLE_JUMP_IMPULSE;
        p.jumpsLeft = 0;
        if (window.GCFCAudio && this.state.sfxEnabled) window.GCFCAudio.playJump(true, this.state.sfxVolume);
      } else {
        this.jumpBuffer = cfg.JUMP_BUFFER;
      }
      this.jumpPressed = false;
    }

    p.vy = Math.min(cfg.MAX_FALL_SPEED, p.vy + cfg.GRAVITY * dt);
    p.y += p.vy * dt;

    const floorY = cfg.GROUND_Y - cfg.PLAYER_H / 2;
    if (p.y >= floorY) {
      p.y = floorY;
      p.vy = 0;
      if (!p.onGround) {
        p.onGround = true;
        p.jumpsLeft = 2;
        this.coyoteTime = cfg.COYOTE_TIME;
      }
      if (this.jumpBuffer > 0) {
        p.vy = cfg.JUMP_IMPULSE;
        p.onGround = false;
        p.jumpsLeft = 1;
        this.jumpBuffer = 0;
      }
    } else {
      p.onGround = false;
    }

    const skin = this.state.currentSkin;
    if (!p.onGround) {
      p.setTexture(p.vy < 0 ? `cat-${skin}-jump` : `cat-${skin}-fall`);
    } else if (moveLeft || moveRight) {
      const frame = Math.floor(time / 100) % 2 === 0 ? "run-1" : "run-2";
      p.setTexture(`cat-${skin}-${frame}`);
    } else {
      p.setTexture(`cat-${skin}-idle`);
    }
  }
}
```

Note: the `window.GCFCAudio` calls reference a module written in Task 9; guarded with `if (window.GCFCAudio && ...)` so this task runs correctly before Task 9 lands.

- [ ] **Step 2: Manually verify**

Serve and open the game, click Play from Home. Use A/D/arrows to move, Space/W/Up to jump (verify double jump works — jump again mid-air), confirm the cat cannot leave `PLAYER_MIN_X`/`PLAYER_MAX_X` bounds and lands back on the ground line without falling through.
Expected: movement, single jump, and double jump all work; landing resets jump count; texture swaps between idle/run/jump/fall as expected.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/PlayScene.js
git commit -m "Add PlayScene with player movement, jump, and double jump"
```

---

### Task 4: PlayScene — scrolling obstacles, platforms, and collision

**Files:**
- Modify: `src/scenes/PlayScene.js`

**Interfaces:**
- Consumes: texture keys `platform`, `obstacle-fishbone`, `obstacle-cactus`, `obstacle-bird`, `obstacle-yarn`.
- Produces: `this.obstacles` and `this.platforms` Phaser Groups on the scene, `this.scrollSpeed` (number, ramps from `BASE_SCROLL_SPEED` to `MAX_SCROLL_SPEED`), `this.elapsed` (seconds survived), `this.gameOver()` method that Task 6 will call on fatal collision.

- [ ] **Step 1: Add scroll speed, spawning, and collision to `create()` and `update()`**

Add to `create()`, after existing player/input setup:

```javascript
    this.elapsed = 0;
    this.scrollSpeed = cfg.BASE_SCROLL_SPEED;
    this.obstacles = this.add.group();
    this.platforms = this.add.group();
    this.nextSpawnIn = 1.2;
    this.gameOverFired = false;

    this.groundHazardTypes = ["obstacle-fishbone", "obstacle-cactus", "obstacle-yarn"];
```

Add a new method (place after `update()`):

```javascript
  spawnObstacle() {
    const cfg = window.GCFC_CONFIG;
    const onPlatform = Math.random() < 0.35;
    const key = onPlatform
      ? "obstacle-bird"
      : this.groundHazardTypes[Math.floor(Math.random() * this.groundHazardTypes.length)];
    const y = onPlatform ? cfg.GROUND_Y - 140 : cfg.GROUND_Y - 24;
    const obstacle = this.physics.add.sprite(cfg.WORLD_W + 60, y, key);
    obstacle.body.allowGravity = false;
    obstacle.nearMissFired = false;
    this.obstacles.add(obstacle);
  }

  spawnPlatform() {
    const cfg = window.GCFC_CONFIG;
    const y = cfg.GROUND_Y - 90 - Math.random() * 120;
    const platform = this.physics.add.sprite(cfg.WORLD_W + 80, y, "platform");
    platform.body.allowGravity = false;
    this.platforms.add(platform);
  }

  gameOver() {
    if (this.gameOverFired) return;
    this.gameOverFired = true;
    this.scene.start("GameOver", { score: Math.floor(this.score || 0) });
  }
```

Add to `update()`, after the existing player physics block:

```javascript
    this.elapsed += dt;
    this.scrollSpeed = Math.min(cfg.MAX_SCROLL_SPEED, cfg.BASE_SCROLL_SPEED + this.elapsed * cfg.SPEED_RAMP_RATE);

    this.nextSpawnIn -= dt;
    if (this.nextSpawnIn <= 0) {
      this.spawnObstacle();
      if (Math.random() < 0.4) this.spawnPlatform();
      this.nextSpawnIn = Math.max(0.6, 1.4 - this.elapsed * 0.01);
    }

    this.obstacles.getChildren().forEach((o) => {
      o.x -= this.scrollSpeed * dt;
      if (o.x < -60) o.destroy();

      const overlapX = Math.abs(o.x - p.x) < 40;
      const gap = Math.abs(o.y - p.y);
      if (!o.nearMissFired && overlapX && !p.onGround && gap < cfg.NEAR_MISS_GAP) {
        o.nearMissFired = true;
        this.time.timeScale = cfg.NEAR_MISS_TIMESCALE;
        this.physics.world.timeScale = cfg.NEAR_MISS_TIMESCALE;
        if (window.GCFCAudio && this.state.sfxEnabled) window.GCFCAudio.playNearMiss(this.state.sfxVolume);
        this.time.delayedCall(cfg.NEAR_MISS_SLOWMO_DURATION * 1000, () => {
          this.time.timeScale = 1;
          this.physics.world.timeScale = 1;
        });
      }

      const hitX = Math.abs(o.x - p.x) < 34;
      const hitY = Math.abs(o.y - p.y) < 34;
      if (hitX && hitY) this.gameOver();
    });

    this.platforms.getChildren().forEach((pl) => {
      pl.x -= this.scrollSpeed * dt;
      if (pl.x < -80) pl.destroy();
    });
```

Note: the `window.GCFCAudio.playNearMiss` call references a module written in Task 9; guarded as above.

- [ ] **Step 2: Manually verify**

Play the game for 20-30 seconds. Confirm obstacles and platforms spawn from the right edge and scroll left at increasing speed, near-miss slow-motion triggers when jumping close over a ground obstacle, and colliding with an obstacle transitions to a `"GameOver"` scene (a blank/erroring scene is fine — it's implemented in Task 6).

Run: check browser console for errors while playing.
Expected: no uncaught exceptions; obstacles/platforms recycle (destroyed off-screen, not accumulating indefinitely — verify via `this.obstacles.getChildren().length` logged occasionally stays bounded).

- [ ] **Step 3: Commit**

```bash
git add src/scenes/PlayScene.js
git commit -m "Add obstacle/platform spawning, scrolling, near-miss, and collision to PlayScene"
```

---

### Task 5: PlayScene — collectibles, combo, and HUD

**Files:**
- Modify: `src/scenes/PlayScene.js`

**Interfaces:**
- Consumes: texture keys `fish`, `paw`, `trail-{trailId}`.
- Produces: `this.score` (number), `this.fishThisRun` (number), `this.comboStreak` / `this.comboMult` (number), in-scene HUD text objects updated live.

- [ ] **Step 1: Add collectible spawning, combo tracking, and HUD to `create()`**

Add to `create()`:

```javascript
    this.score = 0;
    this.fishThisRun = 0;
    this.comboStreak = 0;
    this.comboMult = 1;
    this.collectibles = this.add.group();

    this.hudScoreText = this.add.text(20, 16, "SCORE: 0", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "22px", color: "#3d3b4f", fontStyle: "700",
    });
    this.hudComboText = this.add.text(20, 44, "", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "18px", color: "#ff6b8b", fontStyle: "700",
    });
    this.hudBestText = this.add.text(cfg.WORLD_W - 20, 16, `BEST: ${this.state.bestScore.toLocaleString()}`, {
      fontFamily: "Baloo 2, sans-serif", fontSize: "18px", color: "#3d3b4f",
    }).setOrigin(1, 0);

    this.trailEmitter = this.add.particles(0, 0, `trail-${this.state.currentTrail}`, {
      speed: 20, scale: { start: 0.6, end: 0 }, lifespan: 300, frequency: 60, follow: this.player,
      followOffset: { x: -30, y: 10 },
    });
```

Add a new method:

```javascript
  spawnCollectible() {
    const cfg = window.GCFC_CONFIG;
    const isPaw = Math.random() < 0.3;
    const y = cfg.GROUND_Y - 60 - Math.random() * 160;
    const item = this.physics.add.sprite(cfg.WORLD_W + 40, y, isPaw ? "paw" : "fish");
    item.body.allowGravity = false;
    item.isPaw = isPaw;
    this.collectibles.add(item);
  }

  updateCombo() {
    const cfg = window.GCFC_CONFIG;
    for (const tier of cfg.COMBO_TIERS) {
      if (this.comboStreak >= tier.streak) {
        this.comboMult = tier.mult;
        break;
      }
    }
  }
```

Add to `update()`, after the obstacle loop:

```javascript
    this.collectSpawnTimer = (this.collectSpawnTimer || 0) - dt;
    if (this.collectSpawnTimer <= 0) {
      this.spawnCollectible();
      this.collectSpawnTimer = 0.8;
    }

    this.collectibles.getChildren().forEach((item) => {
      item.x -= this.scrollSpeed * dt;
      if (item.x < -40) {
        item.destroy();
        this.comboStreak = 0;
        this.comboMult = 1;
        return;
      }
      const hit = Math.abs(item.x - p.x) < 36 && Math.abs(item.y - p.y) < 36;
      if (hit) {
        this.comboStreak += 1;
        this.updateCombo();
        this.score += 10 * this.comboMult;
        if (!item.isPaw) this.fishThisRun += 1;
        if (window.GCFCAudio && this.state.sfxEnabled) {
          window.GCFCAudio.playCollect(item.isPaw, this.state.sfxVolume);
        }
        item.destroy();
      }
    });

    this.score += this.scrollSpeed * dt * 0.02;
    this.hudScoreText.setText(`SCORE: ${Math.floor(this.score).toLocaleString()}`);
    this.hudComboText.setText(this.comboMult > 1 ? `COMBO x${this.comboMult}` : "");
```

Note: the `window.GCFCAudio.playCollect` call references a module written in Task 9; guarded as above.

- [ ] **Step 2: Manually verify**

Play the game and collect several fish/paws in a row without missing.
Expected: score increases on collection, combo multiplier text appears and increases at streak thresholds (5, 12, 20, 30), missing a collectible (letting it scroll off-screen) resets the combo to x1.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/PlayScene.js
git commit -m "Add collectibles, combo system, trail particles, and live HUD to PlayScene"
```

---

### Task 6: GameOverScene and pause wiring

**Files:**
- Create: `src/scenes/GameOverScene.js`
- Create: `src/scenes/PauseScene.js`
- Modify: `src/scenes/PlayScene.js`

**Interfaces:**
- Consumes: `data.score` passed via `this.scene.start("GameOver", { score })`, texture keys `ui-board-gameover`, `ui-btn-retry`, `ui-btn-home`.
- Produces: Scene keys `"GameOver"` and `"Pause"`. `GameOverScene` persists `bestScore`/`totalFish`/`highScoresList` via `window.GCFCStorage.save()`.

- [ ] **Step 1: Write `src/scenes/GameOverScene.js`**

```javascript
class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const cx = cfg.WORLD_W / 2;
    const state = window.GCFCStorage.load();

    const isNewBest = this.finalScore > state.bestScore;
    if (isNewBest) state.bestScore = this.finalScore;
    state.totalFish += this.registry.get("fishThisRun") || 0;
    state.highScoresList = [...state.highScoresList, { score: this.finalScore, date: Date.now() }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    window.GCFCStorage.save(state);

    this.add.image(cx, cfg.WORLD_H / 2 - 20, "ui-board-gameover").setScale(0.9);
    this.add.text(cx, cfg.WORLD_H / 2 - 80, "GAME OVER", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "30px", color: "#3d3b4f", fontStyle: "800",
    }).setOrigin(0.5);
    this.add.text(cx, cfg.WORLD_H / 2 - 30, `SCORE: ${this.finalScore.toLocaleString()}`, {
      fontFamily: "Baloo 2, sans-serif", fontSize: "22px", color: "#3d3b4f",
    }).setOrigin(0.5);
    if (isNewBest) {
      this.add.text(cx, cfg.WORLD_H / 2, "NEW BEST!", {
        fontFamily: "Baloo 2, sans-serif", fontSize: "18px", color: "#ff9d42", fontStyle: "700",
      }).setOrigin(0.5);
    }

    const retryBtn = this.add.image(cx - 90, cfg.WORLD_H / 2 + 100, "ui-btn-retry").setScale(0.7).setInteractive({ useHandCursor: true });
    retryBtn.on("pointerup", () => this.scene.start("Play"));

    const homeBtn = this.add.image(cx + 90, cfg.WORLD_H / 2 + 100, "ui-btn-home").setScale(0.7).setInteractive({ useHandCursor: true });
    homeBtn.on("pointerup", () => this.scene.start("Home"));
  }
}
```

- [ ] **Step 2: Write `src/scenes/PauseScene.js`**

```javascript
class PauseScene extends Phaser.Scene {
  constructor() {
    super("Pause");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const cx = cfg.WORLD_W / 2;
    this.add.rectangle(cx, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0x000000, 0.5);
    this.add.text(cx, cfg.WORLD_H / 2 - 60, "PAUSED", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "28px", color: "#ffffff", fontStyle: "800",
    }).setOrigin(0.5);

    const resumeBtn = this.add.text(cx, cfg.WORLD_H / 2, "▶ RESUME", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "20px", color: "#ffffff", backgroundColor: "#6fcf97", padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    resumeBtn.on("pointerup", () => {
      this.scene.stop();
      this.scene.resume("Play");
    });

    const homeBtn = this.add.text(cx, cfg.WORLD_H / 2 + 60, "🏠 HOME", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "20px", color: "#ffffff", backgroundColor: "#4fa8e0", padding: { x: 16, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    homeBtn.on("pointerup", () => {
      this.scene.stop();
      this.scene.stop("Play");
      this.scene.start("Home");
    });
  }
}
```

- [ ] **Step 3: Wire pause key and fish tracking into `PlayScene`**

Add to `PlayScene.create()`:

```javascript
    this.input.keyboard.on("keydown-ESC", () => this.togglePause());
```

Add a new method:

```javascript
  togglePause() {
    this.registry.set("fishThisRun", this.fishThisRun);
    this.scene.pause();
    this.scene.launch("Pause");
  }
```

Modify the existing `gameOver()` method to store `fishThisRun` before transitioning:

```javascript
  gameOver() {
    if (this.gameOverFired) return;
    this.gameOverFired = true;
    if (window.GCFCAudio && this.state.sfxEnabled) window.GCFCAudio.playCollide(this.state.sfxVolume);
    if (window.GCFCAudio) window.GCFCAudio.stopBGM();
    this.registry.set("fishThisRun", this.fishThisRun);
    this.scene.start("GameOver", { score: Math.floor(this.score || 0) });
  }
```

Note: the `window.GCFCAudio.playCollide`/`stopBGM` calls reference a module written in Task 9; guarded as above.

- [ ] **Step 4: Manually verify**

Play until colliding with an obstacle; confirm `GameOverScene` shows the correct score, persists a new best score if applicable (check via `localStorage.getItem("gcfc_best")` in devtools), and Retry/Home buttons work. Press Escape during play; confirm `PauseScene` overlays and Resume/Home both work correctly.

- [ ] **Step 5: Commit**

```bash
git add src/scenes/GameOverScene.js src/scenes/PauseScene.js src/scenes/PlayScene.js
git commit -m "Add GameOverScene, PauseScene, and pause/game-over wiring"
```

---

### Task 7: ShopScene

**Files:**
- Create: `src/scenes/ShopScene.js`

**Interfaces:**
- Consumes: `window.GCFC_CATALOG.SKINS`, `window.GCFC_CATALOG.TRAILS`, `window.GCFCStorage.load()/save()`, texture keys `cat-{skinId}-idle`, `trail-{trailId}`, `ui-btn-close`.
- Produces: Scene key `"Shop"`.

- [ ] **Step 1: Write `src/scenes/ShopScene.js`**

```javascript
class ShopScene extends Phaser.Scene {
  constructor() {
    super("Shop");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const cx = cfg.WORLD_W / 2;
    this.state = window.GCFCStorage.load();
    this.tab = "skins";

    this.add.rectangle(cx, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0x000000, 0.6);
    this.add.text(cx, 30, "SHOP", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "26px", color: "#ffffff", fontStyle: "800",
    }).setOrigin(0.5);
    this.fishText = this.add.text(cx, 60, `🐟 ${this.state.totalFish}`, {
      fontFamily: "Baloo 2, sans-serif", fontSize: "18px", color: "#ffe066",
    }).setOrigin(0.5);

    const tabSkinsBtn = this.add.text(cx - 60, 90, "SKINS", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "14px", color: "#ffffff", backgroundColor: "#6fcf97", padding: { x: 10, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const tabTrailsBtn = this.add.text(cx + 60, 90, "TRAILS", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "14px", color: "#ffffff", backgroundColor: "#3d3b4f", padding: { x: 10, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    tabSkinsBtn.on("pointerup", () => { this.tab = "skins"; this.renderGrid(); });
    tabTrailsBtn.on("pointerup", () => { this.tab = "trails"; this.renderGrid(); });

    const closeBtn = this.add.image(cfg.WORLD_W - 30, 30, "ui-btn-close").setScale(0.3).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerup", () => this.scene.start("Home"));

    this.gridContainer = this.add.container(0, 0);
    this.renderGrid();
  }

  renderGrid() {
    this.gridContainer.removeAll(true);
    const items = this.tab === "skins" ? window.GCFC_CATALOG.SKINS : window.GCFC_CATALOG.TRAILS;
    const ownedList = this.tab === "skins" ? this.state.unlockedSkins : this.state.unlockedTrails;
    const current = this.tab === "skins" ? this.state.currentSkin : this.state.currentTrail;

    items.forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 180 + col * 300;
      const y = 160 + row * 140;
      const owned = ownedList.includes(item.id);

      const icon = this.tab === "skins"
        ? this.add.image(x, y, `cat-${item.id}-idle`).setScale(0.7)
        : this.add.image(x, y, `trail-${item.id}`).setScale(1.5);
      const label = this.add.text(x, y + 40, item.name, {
        fontFamily: "Baloo 2, sans-serif", fontSize: "14px", color: "#ffffff",
      }).setOrigin(0.5);
      const statusText = owned
        ? (current === item.id ? "ĐANG DÙNG" : "CHỌN")
        : `🐟 ${item.price}`;
      const statusBtn = this.add.text(x, y + 60, statusText, {
        fontFamily: "Baloo 2, sans-serif", fontSize: "13px", color: "#3d3b4f",
        backgroundColor: current === item.id ? "#6fcf97" : "#ffe066", padding: { x: 10, y: 4 },
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      statusBtn.on("pointerup", () => this.handlePurchaseOrEquip(item, owned));

      this.gridContainer.add([icon, label, statusBtn]);
    });
  }

  handlePurchaseOrEquip(item, owned) {
    if (owned) {
      if (this.tab === "skins") this.state.currentSkin = item.id;
      else this.state.currentTrail = item.id;
    } else if (this.state.totalFish >= item.price) {
      this.state.totalFish -= item.price;
      if (this.tab === "skins") this.state.unlockedSkins.push(item.id);
      else this.state.unlockedTrails.push(item.id);
    } else {
      return;
    }
    window.GCFCStorage.save(this.state);
    this.fishText.setText(`🐟 ${this.state.totalFish}`);
    this.renderGrid();
  }
}
```

- [ ] **Step 2: Manually verify**

Open Shop from Home. Confirm all 6 skins display in the Skins tab, and clicking the Trails tab shows all 6 trails, with correct owned/locked state matching current `localStorage`. Purchase a skin with enough fish; confirm fish count decreases and the skin becomes equippable. Equip a skin; return to Home and confirm the idle texture reflects the new skin.

- [ ] **Step 3: Commit**

```bash
git add src/scenes/ShopScene.js
git commit -m "Add ShopScene with skin/trail purchase and equip"
```

---

### Task 8: LeaderboardScene and SettingsScene

**Files:**
- Create: `src/scenes/LeaderboardScene.js`
- Create: `src/scenes/SettingsScene.js`

**Interfaces:**
- Consumes: `window.GCFCStorage.load()/save()`, texture keys `ui-board-highscore`, `ui-btn-close`.
- Produces: Scene keys `"Leaderboard"` and `"Settings"`.

- [ ] **Step 1: Write `src/scenes/LeaderboardScene.js`**

```javascript
class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super("Leaderboard");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const cx = cfg.WORLD_W / 2;
    const state = window.GCFCStorage.load();

    this.add.rectangle(cx, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0x000000, 0.6);
    this.add.image(cx, cfg.WORLD_H / 2, "ui-board-highscore").setScale(0.9);
    this.add.text(cx, 60, "BẢNG XẾP HẠNG", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "24px", color: "#3d3b4f", fontStyle: "800",
    }).setOrigin(0.5);

    const list = state.highScoresList.length ? state.highScoresList : [{ score: state.bestScore, date: Date.now() }];
    list.slice(0, 10).forEach((entry, i) => {
      this.add.text(cx, 110 + i * 30, `#${i + 1}   ${entry.score.toLocaleString()}`, {
        fontFamily: "Baloo 2, sans-serif", fontSize: "16px", color: "#3d3b4f",
      }).setOrigin(0.5);
    });

    const closeBtn = this.add.image(cfg.WORLD_W - 30, 30, "ui-btn-close").setScale(0.3).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerup", () => this.scene.start("Home"));
  }
}
```

- [ ] **Step 2: Write `src/scenes/SettingsScene.js`**

```javascript
class SettingsScene extends Phaser.Scene {
  constructor() {
    super("Settings");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    const cx = cfg.WORLD_W / 2;
    this.state = window.GCFCStorage.load();

    this.add.rectangle(cx, cfg.WORLD_H / 2, cfg.WORLD_W, cfg.WORLD_H, 0x000000, 0.6);
    this.add.text(cx, 50, "CÀI ĐẶT", {
      fontFamily: "Baloo 2, sans-serif", fontSize: "24px", color: "#ffffff", fontStyle: "800",
    }).setOrigin(0.5);

    this.addToggle(cx, 130, "Nhạc nền", "bgmEnabled");
    this.addToggle(cx, 180, "Âm thanh", "sfxEnabled");
    this.addToggle(cx, 230, "Rung màn hình", "shakeEnabled");
    this.addToggle(cx, 280, "Giảm chuyển động", "reduceMotion");

    const closeBtn = this.add.image(cfg.WORLD_W - 30, 30, "ui-btn-close").setScale(0.3).setInteractive({ useHandCursor: true });
    closeBtn.on("pointerup", () => {
      window.GCFCStorage.save(this.state);
      this.scene.start("Home");
    });
  }

  addToggle(x, y, label, stateKey) {
    this.add.text(x - 100, y, label, {
      fontFamily: "Baloo 2, sans-serif", fontSize: "16px", color: "#ffffff",
    }).setOrigin(0, 0.5);

    const renderState = () => this.state[stateKey] ? "BẬT" : "TẮT";
    const btn = this.add.text(x + 100, y, renderState(), {
      fontFamily: "Baloo 2, sans-serif", fontSize: "16px", color: "#3d3b4f",
      backgroundColor: this.state[stateKey] ? "#6fcf97" : "#eb5757", padding: { x: 12, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on("pointerup", () => {
      this.state[stateKey] = !this.state[stateKey];
      btn.setText(renderState());
      btn.setBackgroundColor(this.state[stateKey] ? "#6fcf97" : "#eb5757");
    });
  }
}
```

- [ ] **Step 3: Manually verify**

Open Leaderboard from Home; confirm scores list renders (even if empty/default). Open Settings; toggle each switch and confirm it flips visually; close Settings and reopen to confirm the toggled state persisted via `localStorage`.

- [ ] **Step 4: Commit**

```bash
git add src/scenes/LeaderboardScene.js src/scenes/SettingsScene.js
git commit -m "Add LeaderboardScene and SettingsScene"
```

---

### Task 9: Audio — procedural Web Audio synth (ported from game.js)

**Files:**
- Create: `src/audio.js`
- Modify: `index.html`
- Modify: `src/scenes/PlayScene.js`

**Interfaces:**
- Produces: `window.GCFCAudio` object with methods `playJump(isDouble, volume)`, `playCollect(isPaw, volume)`, `playNearMiss(volume)`, `playCollide(volume)`, `startBGM(volume)`, `stopBGM()`, `resumeContext()`. All the `window.GCFCAudio.*` call sites already added (guarded) in Tasks 3/4/5/6 become live once this file loads.

- [ ] **Step 1: Write `src/audio.js`**

Ported directly from `game.js`'s existing `initAudio`/`playTone`/`playJumpSound`/`playFishSound`/`playPawSound`/`playNearMissSound`/`playHitSound`/BGM-interval functions (`game.js:60-184`), adapted into a standalone module:

```javascript
window.GCFCAudio = (() => {
  let audioCtx = null;
  let bgmInterval = null;
  let bgmStep = 0;
  const BGM_NOTES = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];

  function resumeContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  }

  function playTone(freq, duration, type, gainVal) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playJump(isDouble, volume) {
    if (!audioCtx) return;
    try {
      const startF = isDouble ? 420 : 300;
      const endF = isDouble ? 720 : 540;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(startF, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endF, audioCtx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playCollect(isPaw, volume) {
    if (!audioCtx) return;
    if (isPaw) {
      playTone(880, 0.08, "triangle", 0.18 * volume);
      return;
    }
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playNearMiss(volume) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.3 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.23);
    } catch (e) {}
  }

  function playCollide(volume) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3 * volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  function startBGM(volume) {
    stopBGM();
    resumeContext();
    bgmInterval = setInterval(() => {
      if (!audioCtx) return;
      const note = BGM_NOTES[bgmStep % BGM_NOTES.length];
      bgmStep++;
      playTone(note, 0.18, "sine", 0.05 * volume);
    }, 240);
  }

  function stopBGM() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  return { resumeContext, playJump, playCollect, playNearMiss, playCollide, startBGM, stopBGM };
})();
```

- [ ] **Step 2: Add `src/audio.js` script tag to `index.html`**

Add `<script src="src/audio.js"></script>` immediately after the `src/textures.js` tag and before `src/scenes/BootScene.js`, matching the placement already shown in Task 1's `index.html` listing (that listing already includes this line — if Task 1 was completed with the line commented out or omitted per its note, uncomment/add it now).

- [ ] **Step 3: Wire BGM start/resume into `PlayScene`**

Add to `PlayScene.create()`, after `this.state = window.GCFCStorage.load();`:

```javascript
    window.GCFCAudio.resumeContext();
    if (this.state.bgmEnabled) window.GCFCAudio.startBGM(this.state.bgmVolume);
```

Add to the existing `gameOver()` method — it already calls `window.GCFCAudio.stopBGM()` from Task 6's guarded call; the guard (`if (window.GCFCAudio)`) can now be simplified since the module is guaranteed loaded, but leaving the guard in place is harmless and requires no change.

- [ ] **Step 4: Manually verify**

Play the game with sound on (click/interact first, since browsers require a user gesture before `AudioContext` audio plays): confirm BGM plays a looping melody, jump/eat-fish/eat-paw/near-miss/collide SFX all play at appropriate moments, and toggling `sfxEnabled`/`bgmEnabled` off via Settings (then returning to Play) silences the respective audio.

- [ ] **Step 5: Commit**

```bash
git add src/audio.js index.html src/scenes/PlayScene.js
git commit -m "Add procedural Web Audio synth ported from game.js, wire into PlayScene"
```

---

### Task 10: Clean up index.html, style.css, and remove old game.js

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Delete: `game.js`

**Interfaces:**
- None (cleanup task).

- [ ] **Step 1: Remove old screen-overlay markup from `index.html`**

Delete the `#screen-start`, `#screen-gameover`, `#screen-pause`, `#screen-leaderboard`, `#screen-settings`, `#screen-shop`, and `#hud` DOM blocks (now implemented as Phaser scenes) and the old `<canvas id="game-canvas">` tag if it still exists (Phaser creates its own canvas under `#game-container` per Task 1's config — if Task 1 already removed it, this is a no-op). Keep `#game-container`, the mobile D-pad/Jump buttons (`#btn-left`, `#btn-right`, `#btn-jump`), and `#top-controls`. Remove the old `<script src="game.js"></script>` tag if still present (superseded by Task 1's script tags).

- [ ] **Step 2: Trim `style.css`**

Remove CSS rules that target the deleted `#screen-*` / `#hud` selectors and their descendants. Keep rules for `#game-container`, mobile control buttons, `#top-controls`, body/page shell, and the `Baloo 2` font application.

- [ ] **Step 3: Delete `game.js`**

Run: `git rm game.js`

- [ ] **Step 4: Manually verify full game loop end-to-end**

Serve the project and play through: Home → Play (move, jump, double jump, collect fish/paws, trigger a combo, trigger a near-miss, hit an obstacle) → GameOver (retry and home both work) → Shop (purchase and equip a skin and a trail) → Leaderboard → Settings (toggle each option) → mobile controls (resize browser to a narrow/touch-emulated viewport and confirm D-pad/Jump buttons still work).

Expected: no console errors anywhere in the flow; no dead/orphaned CSS selectors remain (spot-check with browser devtools "unused CSS" or manual read-through). Visuals are procedurally-drawn shapes rather than the hand-authored art shown in `game-home.png`/`game-play.png`/`game-over.png` — layout/flow parity is what's being verified here, not pixel-level art parity (per the spec Amendment).

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "Remove legacy Canvas overlay markup and old game.js"
```

---

### Task 11: Update README and game agent docs for Phaser architecture

**Files:**
- Modify: `README.md`
- Modify: `.claude/agents/game-planner.md`
- Modify: `.claude/agents/game-coder.md`
- Modify: `.claude/agents/game-reviewer.md`
- Modify: `.claude/agents/game-tester.md`

**Interfaces:**
- None (documentation task).

- [ ] **Step 1: Update `README.md`**

Change the engine badge/description from "HTML5 Canvas 2D" / "Vanilla JavaScript" to reflect Phaser 3, update the project structure section (`README.md:73-84`) to list `src/scenes/*.js`, `src/config.js`, `src/catalog.js`, `src/storage.js`, `src/textures.js`, `src/audio.js` instead of a single `game.js`, and update the "Tùy biến hình ảnh (Assets)" section to explain that visuals are currently generated procedurally at runtime via `Phaser.GameObjects.Graphics` (not loaded from `assets/`), since no image-generation tool was available during this migration — note that swapping in real sprite files later only requires changing `BootScene`'s texture-generation step.

- [ ] **Step 2: Update `.claude/agents/game-planner.md`**

Replace references to "vanilla HTML5 Canvas 2D side-scrolling platformer" and "plain `index.html` + `style.css` + `game.js` (no build step, no framework, no bundler)" with: "a Phaser 3 side-scrolling platformer loaded via CDN script tag (no bundler), with gameplay split across `src/scenes/*.js` (Boot, Home, Play, Pause, GameOver, Shop, Leaderboard, Settings) plus shared `src/config.js` / `src/catalog.js` / `src/storage.js` / `src/textures.js` / `src/audio.js`. All visuals/audio are generated procedurally at runtime (`src/textures.js`, `src/audio.js`) rather than loaded from `assets/`." Keep the rest of its planning workflow (comparing against `game-home.png`/`game-play.png`/`game-over.png`) unchanged, but note that current visuals are procedural shapes, not hand-authored art, so comparisons should focus on layout/flow rather than pixel-level art fidelity.

- [ ] **Step 3: Update `.claude/agents/game-coder.md`**

Same architecture description update as Step 2. Update any instruction that assumes a single `game.js` file to instead say changes are typically scoped to one or two files under `src/scenes/` (plus `index.html`/`style.css` for DOM/layout changes, or `src/textures.js`/`src/audio.js` for visual/audio changes), following the Scene structure established by the migration.

- [ ] **Step 4: Update `.claude/agents/game-reviewer.md`**

Same architecture description update. Update the "What to check" section's Canvas-specific correctness notes (e.g. any mention of manual canvas coordinate math or hand-rolled animation loops) to instead reference Phaser Scene lifecycle methods (`preload`/`create`/`update`), Arcade Physics body state, the `generateTexture()`-based texture pipeline in `src/textures.js`, and the frozen `localStorage` key contract from this plan's Global Constraints.

- [ ] **Step 5: Update `.claude/agents/game-tester.md`**

Same architecture description update. Keep the existing "launch and visually compare against target screenshots" workflow, but add a note that current visuals are procedurally-drawn placeholder shapes rather than the hand-authored art the screenshots depict, so comparisons should focus on layout/flow/functionality rather than pixel-level art fidelity until real sprites are supplied.

- [ ] **Step 6: Verify docs are internally consistent**

Run: `grep -rn "Canvas 2D\|game\.js\|no build step" README.md .claude/agents/*.md`
Expected: remaining matches (if any) are either intentional ("no build step" is still true and should stay) or clearly describe the new Phaser architecture, not stale references to the deleted single-file `game.js`.

- [ ] **Step 7: Commit**

```bash
git add README.md .claude/agents/game-planner.md .claude/agents/game-coder.md .claude/agents/game-reviewer.md .claude/agents/game-tester.md
git commit -m "Update README and game subagent docs for Phaser 3 architecture"
```

---

## Self-Review Notes

- **Spec coverage:** All spec sections (as amended) are covered — Scene structure (Tasks 1-8), physics mapping (Tasks 3-4), audio mapping (Task 9), persistence (Task 1 storage.js, reused by 2/6/7/8), procedurally-generated textures (Task 1's `textures.js`), files-touched list (all touched: game.js deleted in Task 10, index.html/style.css in Tasks 1 & 10, README/agents in Task 11).
- **Mobile controls:** Task 3 binds to `#btn-left`/`#btn-right`/`#btn-jump` DOM elements assumed to already exist in `index.html`'s retained mobile control markup (per spec decision to keep DOM buttons) — Task 10 step 1 explicitly preserves these ids when cleaning up markup.
- **Amendment history:** the original Phase 1 (7 asset-generation tasks) and the original Task 16 (MP3-based audio) were replaced after discovering, during setup for subagent-driven execution, that no image- or audio-generation tool exists in this environment. Ruling recorded in the SDD ledger (`.superpowers/sdd/2026-09-22-phaser-migration/progress.md`) and reflected in the spec's Amendment section. This is a plan/spec revision, not a deviation made silently during implementation.
