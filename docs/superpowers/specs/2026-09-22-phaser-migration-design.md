# Gravity Cat: Fish Chase — Migration to Phaser 3

## Context

The game currently exists as a complete, working implementation in vanilla
JavaScript + hand-rolled Canvas 2D (`game.js`, ~2400 lines, IIFE), with HTML
overlay screens (`#screen-start`, `#screen-gameover`, `#screen-pause`,
`#screen-leaderboard`, `#screen-settings`, `#screen-shop`) layered on top of
the canvas via `index.html` + `style.css`. There is no build step — the game
runs by opening `index.html` directly or serving statically
(`python3 -m http.server`, `npx serve`).

The project's `game_design_document_gravity_cat_fish_chase.md` (GDD) actually
recommends Phaser.js v3 as the target engine, but the shipped implementation
never adopted it. This spec covers rewriting the engine layer onto Phaser 3
while preserving all existing gameplay features and the pastel visual style.

Decisions locked in during brainstorming:
- Full rewrite of the engine onto Phaser 3, not a partial/hybrid approach.
- All existing features ported in one pass (no phased core-then-extras split).
- Phaser loaded via CDN `<script>` tag — no npm/bundler/build step introduced.
- Mobile D-pad/Jump controls stay as HTML/CSS DOM buttons overlaid on the
  canvas (not rebuilt as Phaser input sprites).

**Amendment (post-approval, during implementation):** the original design
called for regenerating all sprites from scratch as PNG files via an image
generation tool, and sourcing new audio files for SFX/BGM. Neither an
image-generation tool nor an audio-generation/sourcing tool is available in
the implementation environment, and this was only discovered after this
spec was approved and the plan written (see `docs/superpowers/plans/2026-09-22-phaser-migration.md`
ledger for the ruling). **Ruling:** visuals and audio are produced
procedurally at runtime instead of as static asset files:
- **Sprites:** ported from the existing hand-tuned Canvas 2D vector-draw
  functions already in `game.js` (`drawPlayerCat`, `drawObstacle`,
  `drawCollectible`, `drawPlatform`, `drawFluffyCloud`, `drawPawCloud`,
  `drawHeart`, `drawStar`) to `Phaser.GameObjects.Graphics`, rendered once
  per pose/variant into a texture via `generateTexture()` during
  `BootScene`, then referenced exactly like a loaded image by every
  downstream scene (texture-key contracts elsewhere in this spec are
  unchanged). All 6 skins remain visually distinct using the same
  `color`/`earColor`/`spotColor`/`hasCrown`/`isBread`/`isSpace` metadata
  the old code already defines per skin (`game.js:37-45`), rather than via
  6 sets of hand-authored art.
  UI chrome (buttons, boards, plaques) is likewise drawn with `Graphics`
  (rounded rectangles, simple icons) rather than sourced as PNGs.
- **Audio:** ported from the existing Web Audio API synth code already in
  `game.js` (oscillator-based SFX generator and the looped chiptune/lofi
  BGM generator) into a small synth module driven directly by
  `AudioContext`, wired into Phaser scenes alongside (not replacing)
  Phaser's Sound Manager for volume/mute state tracking. This preserves
  the "Web Audio API Synth" approach the README already documents, instead
  of introducing static MP3 files.
- The GDD's/asset-prompts.md's PNG-based asset workflow becomes optional
  future work, not a requirement of this migration: if real sprite/audio
  files are supplied later, they can replace the generated textures by
  changing only `BootScene`'s preload step, since every other scene
  consumes textures purely by key name.

## Current System Inventory (must be preserved)

Read from `game.js`:

**Physics constants** (`game.js:7-27`):
- World: 960×540, `GROUND_Y = WORLD_H - 85`, `CEILING_Y = 75`
- `GRAVITY = 2150`, `JUMP_IMPULSE = -680`, `DOUBLE_JUMP_IMPULSE = -590`,
  `MAX_FALL_SPEED = 940`, `MOVE_SPEED = 330`
- Player bounds: `PLAYER_MIN_X = 50`, `PLAYER_MAX_X = 580`,
  `PLAYER_W = 76`, `PLAYER_H = 68`
- Scroll/difficulty: `BASE_SCROLL_SPEED = 280`, `MAX_SCROLL_SPEED = 650`,
  `SPEED_RAMP_RATE = 2.9` px/s per second survived
- `NEAR_MISS_GAP = 32`
- Double jump via `player.jumpsLeft` (reset to 2 on landing, consumed to 0
  on double jump), plus coyote time / jump buffering (verify exact timing
  constants in code during implementation — not restated here in full).

**Combo system** (`game.js:29-35`): tiered by streak length —
streak≥30 → x5, ≥20 → x4, ≥12 → x3, ≥5 → x2, else x1.

**Near-miss**: per-obstacle `nearMissFired` flag; when the player passes
within `NEAR_MISS_GAP` px while airborne and hasn't triggered it yet, fires
a 0.35s slow-motion window (`nearMissFlash`) plus "MEOW! ✨" feedback.

**Shop catalog — Skins** (`game.js:38-45`), 6 total: Mèo Cam Béo (0, free
default), Mèo Đen Ninja (30), Mèo Tam Thể (60), Mèo Hoàng Gia (100), Mèo
Bánh Mì (140), Mèo Phi Hành (200). Each has color/accent metadata used by
the current vector-draw fallback — under Phaser these are rendered as
generated textures per skin (see Amendment above), keyed off this same
metadata.

**Shop catalog — Trails** (`game.js:48-55`), 6 total: Gió Thoảng (0, free),
Cầu Vồng (40), Bong Bóng (80), Trái Tim (120), Ngôi Sao (160), Hoa Anh Đào
(220).

**Sprites currently wired** (`game.js:60-72`): cat-idle, cat-run, cat-jump,
cat-hurt, fish, paw, obstacle-fishbone, obstacle-cactus, obstacle-bird,
obstacle-yarn, platform.

**Persistence**: best score, total fish collected, and unlocked
skins/trails saved to `localStorage` (exact keys read from `getStorageJSON`
helper during implementation — key names must not change, so existing
players don't lose progress).

**Audio**: Web Audio API hand-synthesized SFX (jump/eat/meow/collide) and a
looped chiptune/lofi BGM generator, plus a mute toggle and separate
BGM/SFX volume sliders.

**Mobile controls**: DOM buttons (`◀ ▶` D-pad, `▲ JUMP`) with
pointerdown/pointerup/pointerleave handlers — stays as-is per the decision
above.

## Target Architecture

### Scene structure (replaces HTML overlay screens)

| Phaser Scene | Replaces | Responsibility |
|---|---|---|
| `BootScene` | (new) | Load all sprite/audio assets, show a loading bar |
| `HomeScene` | `#screen-start` | Title, play button, best score/fish display, links to Shop/Leaderboard/Settings |
| `PlayScene` | canvas gameplay loop | Arcade Physics platformer: movement, jump/double-jump, coyote time, jump buffer, scrolling world, obstacle/collectible spawning, combo, near-miss, in-scene HUD (score, fish count, combo) |
| `PauseScene` | `#screen-pause` | Launched on top of `PlayScene` (`scene.launch`, `scene.pause` on PlayScene) when paused |
| `GameOverScene` | `#screen-gameover` | Final score, best-score check, retry/home actions |
| `ShopScene` | `#screen-shop` | Skin/trail grid, purchase with accumulated fish, equip |
| `LeaderboardScene` | `#screen-leaderboard` | Local high-score list |
| `SettingsScene` | `#screen-settings` | BGM/SFX toggles and volume, screen-shake toggle, perf mode toggle |

All in-game UI (buttons, boards, HUD chrome) renders as Phaser
GameObjects (Image/NineSlice/BitmapText or Text) inside these scenes —
not DOM elements — except the mobile D-pad/Jump buttons, which remain DOM
overlays positioned via CSS same as today.

`index.html` is reduced to a single canvas mount point + the mobile
control buttons + the Phaser CDN `<script>` tag; `style.css` keeps only
what styles the page shell and mobile buttons (the old screen-overlay
CSS for start/gameover/pause/leaderboard/settings/shop is removed since
those are now Phaser scenes).

### Physics mapping

- Player is an Arcade Physics sprite; `GRAVITY`, `JUMP_IMPULSE`,
  `DOUBLE_JUMP_IMPULSE`, `MAX_FALL_SPEED`, `MOVE_SPEED` map directly to
  Arcade Physics body properties / velocity assignments in
  `PlayScene.update()`.
- World scroll: rather than moving a camera through a physically large
  world, keep the current model of a fixed player X range
  (`PLAYER_MIN_X`/`PLAYER_MAX_X`) with obstacles/platforms/collectibles
  spawned at the right edge and moved left at `scrollSpeed`, ramping from
  `BASE_SCROLL_SPEED` to `MAX_SCROLL_SPEED` — this preserves exact existing
  feel and difficulty curve instead of switching to Phaser camera-follow.
- Floating platforms use one-way collision via Arcade Physics
  `body.checkCollision.down` / `oneWayPlatform`-style setup.
- Near-miss and combo logic are game-rule code, not physics-engine
  specific — ported near-verbatim, keyed off Arcade Physics body bounds
  instead of manual AABB math.
- Slow-motion on near-miss uses `this.time.timeScale` and
  `this.physics.world.timeScale` set to ~0.3–0.4 for 0.35s, replacing the
  current manual `dt` scaling.

### Audio mapping

**Superseded by the Amendment above.** No audio files are sourced; the
existing hand-rolled Web Audio synth (SFX generator + looped BGM
generator) is ported into a small `src/audio.js` module, driven by a
scene-shared `AudioContext`, with playback triggered from `PlayScene` at
the same moments the original code did (jump, eat, meow/near-miss,
collide). Preserve the existing mute toggle and independent BGM/SFX
volume controls, persisted the same way as today via the existing
`localStorage` keys.

### Persistence

- Keep the exact `localStorage` key names and JSON shape used today so
  existing players' best score / fish count / unlocks carry over.
- Wrap reads/writes in a small shared module (e.g. `src/storage.js`)
  used by `HomeScene`, `GameOverScene`, and `ShopScene`.

### Assets (generated textures, superseded by the Amendment above)

No PNG files are sourced or generated by an external tool. Instead, every
visual is drawn once with `Phaser.GameObjects.Graphics` and baked to a
named texture via `generateTexture()` during `BootScene`, then referenced
by texture key exactly as a loaded image would be everywhere else in this
spec:

- Player: idle, run (2-frame cycle), jump, fall, hurt — **per skin**, all
  6 skins (Mèo Cam Béo, Mèo Đen Ninja, Mèo Tam Thể, Mèo Hoàng Gia, Mèo
  Bánh Mì, Mèo Phi Hành), generated from one parameterized draw routine
  ported from `game.js`'s `drawPlayerCat`, driven by each skin's
  `color`/`earColor`/`spotColor`/`hasCrown`/`isBread`/`isSpace` metadata
  (`game.js:37-45`) and a pose parameter (leg/tail offsets per pose,
  ported from the same function's animation logic).
- Collectibles: fish, paw print — ported from `drawCollectible`.
- Obstacles: fishbone, cactus, bird, yarn ball — ported from `drawObstacle`.
- Platform tile — ported from `drawPlatform`.
- Trail particle textures for all 6 trails (wind, rainbow, bubble, heart,
  star, sakura) — simple generated shapes (streak, sparkle, circle, heart
  via `drawHeart`, star via `drawStar`, petal), small enough for Phaser's
  particle emitter.
- UI: buttons (play, retry, home, shop, leaderboard, settings, share,
  close), boards/plaques (game-over board, high-score board, wood
  plaques) — drawn as rounded-rectangle `Graphics` shapes with simple
  icon glyphs, styled to match `game-home.png`/`game-play.png`/
  `game-over.png` as closely as procedural shapes reasonably allow.

This is a deliberate visual downgrade from hand-authored art, accepted as
the cost of having no image-generation tool available; swapping in real
PNGs later only requires changing `BootScene`'s preload/texture-generation
step, per the Amendment.

### Files touched

- `game.js` — replaced by a `src/` directory of Phaser scene files (e.g.
  `src/scenes/BootScene.js`, `HomeScene.js`, `PlayScene.js`, etc.) plus
  shared modules (`src/storage.js`, `src/config.js` for constants,
  `src/catalog.js` for skins/trails data). Loaded via plain `<script>`
  tags in dependency order (no bundler), or a single concatenated
  `game.js` if simpler — decide in the implementation plan.
- `index.html` — Phaser CDN script tag, canvas mount div, mobile control
  buttons only; all screen-overlay markup removed.
- `style.css` — trimmed to page shell + mobile control button styles.
- `assets/` — no longer used by the running game (all visuals generated
  procedurally per the Amendment); left in place rather than deleted, in
  case real sprite files are supplied later.
- `README.md` — update engine badge/description (Phaser 3 instead of
  Canvas 2D), keep "no build step" run instructions as-is.
- `.claude/agents/game-planner.md`, `game-coder.md`, `game-reviewer.md`,
  `game-tester.md` — update from "vanilla Canvas 2D, single game.js" to
  reflect the Phaser Scene file layout, since these subagents currently
  hard-code the old architecture and would give stale guidance otherwise.

### Testing

- Manual verification via `game-tester` agent workflow (already exists):
  launch via static server, exercise Home → Play → Game Over → Retry,
  Shop purchase/equip flow, Leaderboard, Settings toggles, and mobile
  D-pad/Jump buttons — visually compared against `game-home.png`,
  `game-play.png`, `game-over.png`.
- No automated test suite exists today and none is introduced by this
  migration (matches current project conventions).

## Out of scope

- No backend/server changes — stays fully static/client-side.
- No new gameplay features beyond what's in the current GDD/implementation.
- No build tooling (npm/Vite/bundler) introduced.
- Not rebuilding mobile D-pad/Jump as Phaser input objects.
