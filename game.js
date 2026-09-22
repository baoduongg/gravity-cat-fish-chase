(() => {
  "use strict";

  // ==========================================
  // CONSTANTS & CONFIGURATION
  // ==========================================
  const WORLD_W = 960;
  const WORLD_H = 540;
  const GROUND_Y = WORLD_H - 80;

  // Physics
  const GRAVITY = 2100;
  const JUMP_IMPULSE = -680;
  const DOUBLE_JUMP_IMPULSE = -590;
  const MAX_FALL_SPEED = 920;
  const MOVE_SPEED = 320;
  const PLAYER_MIN_X = 50;
  const PLAYER_MAX_X = 540;
  const PLAYER_W = 76;
  const PLAYER_H = 68;

  // Progression & Escalation
  const BASE_SCROLL_SPEED = 280;
  const MAX_SCROLL_SPEED = 640;
  const SPEED_RAMP_RATE = 2.8; // px/s per second survived
  const NEAR_MISS_GAP = 30;

  const COMBO_TIERS = [
    { streak: 20, mult: 5 },
    { streak: 12, mult: 3 },
    { streak: 5, mult: 2 },
    { streak: 0, mult: 1 },
  ];

  // Shop Catalog
  const SKINS = [
    { id: "orange", name: "Mèo Cam Béo", price: 0, emoji: "🐱", color: "#ff9d42", earColor: "#ff7043" },
    { id: "black", name: "Mèo Đen Ninja", price: 30, emoji: "🐈‍⬛", color: "#3d3b4f", earColor: "#ff6b8b" },
    { id: "calico", name: "Mèo Tam Thể", price: 60, emoji: "🐾", color: "#f7ebd2", earColor: "#d9742b", spotColor: "#333333" },
    { id: "royal", name: "Mèo Hoàng Gia", price: 100, emoji: "👑", color: "#ffe066", earColor: "#f59f00", hasCrown: true },
    { id: "bread", name: "Mèo Bánh Mì", price: 150, emoji: "🍞", color: "#d4a373", earColor: "#bc6c25", isBread: true },
  ];

  const TRAILS = [
    { id: "wind", name: "Gió Thoảng", price: 0, icon: "💨" },
    { id: "rainbow", name: "Cầu Vồng", price: 40, icon: "🌈" },
    { id: "bubble", name: "Bong Bóng", price: 80, icon: "🫧" },
    { id: "heart", name: "Trái Tim", price: 120, icon: "💖" },
  ];

  // ==========================================
  // WEB AUDIO SYNTHESIZER (No External Files)
  // ==========================================
  let audioCtx = null;
  let isMuted = localStorage.getItem("gcfc_muted") === "true";
  let bgmOsc = null;
  let bgmGain = null;
  let bgmInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration, type = "sine", gainVal = 0.15) {
    if (isMuted || !audioCtx) return;
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

  function playJumpSound(isDouble = false) {
    if (isMuted || !audioCtx) return;
    try {
      const startF = isDouble ? 420 : 300;
      const endF = isDouble ? 720 : 540;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(startF, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endF, audioCtx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {}
  }

  function playFishSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playPawSound() {
    if (isMuted || !audioCtx) return;
    playTone(880, 0.08, "triangle", 0.18);
  }

  function playNearMissSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
      osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.23);
    } catch (e) {}
  }

  function playHitSound() {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  }

  // Soft Procedural Background Chiptune Melody
  const BGM_NOTES = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];
  let bgmStep = 0;
  function startBGM() {
    stopBGM();
    if (isMuted) return;
    initAudio();
    bgmInterval = setInterval(() => {
      if (isMuted || !audioCtx || state !== STATE.PLAYING) return;
      const note = BGM_NOTES[bgmStep % BGM_NOTES.length];
      bgmStep++;
      playTone(note, 0.18, "sine", 0.05);
    }, 240);
  }

  function stopBGM() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  // ==========================================
  // STORAGE & UNLOCKS
  // ==========================================
  const getStorageNumber = (k, def = 0) => Number(localStorage.getItem(k) || def);
  const getStorageJSON = (k, def) => {
    try { return JSON.parse(localStorage.getItem(k)) || def; } catch (e) { return def; }
  };

  let bestScore = getStorageNumber("gcfc_best", 0);
  let totalFish = getStorageNumber("gcfc_totalFish", 0);
  let unlockedSkins = getStorageJSON("gcfc_unlockedSkins", ["orange"]);
  let unlockedTrails = getStorageJSON("gcfc_unlockedTrails", ["wind"]);
  let currentSkin = localStorage.getItem("gcfc_currentSkin") || "orange";
  let currentTrail = localStorage.getItem("gcfc_currentTrail") || "wind";

  function saveGameData() {
    localStorage.setItem("gcfc_best", String(bestScore));
    localStorage.setItem("gcfc_totalFish", String(totalFish));
    localStorage.setItem("gcfc_unlockedSkins", JSON.stringify(unlockedSkins));
    localStorage.setItem("gcfc_unlockedTrails", JSON.stringify(unlockedTrails));
    localStorage.setItem("gcfc_currentSkin", currentSkin);
    localStorage.setItem("gcfc_currentTrail", currentTrail);
    localStorage.setItem("gcfc_muted", String(isMuted));
  }

  // ==========================================
  // DOM REFERENCES
  // ==========================================
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // HUD
  const hud = document.getElementById("hud");
  const hudScore = document.getElementById("hud-score");
  const hudBest = document.getElementById("hud-best");
  const hudFish = document.getElementById("hud-fish");
  const hudComboBadge = document.getElementById("hud-combo-badge");
  const hudComboMult = document.getElementById("hud-combo-mult");
  const btnSoundHud = document.getElementById("btn-sound-hud");

  // Screens
  const screenStart = document.getElementById("screen-start");
  const screenGameOver = document.getElementById("screen-gameover");
  const screenShop = document.getElementById("screen-shop");

  // Start Elements
  const startBest = document.getElementById("start-best");
  const startTotalFish = document.getElementById("start-total-fish");
  const btnPlay = document.getElementById("btn-play");
  const btnOpenShop = document.getElementById("btn-open-shop");

  // Game Over Elements
  const goScore = document.getElementById("go-score");
  const goBest = document.getElementById("go-best");
  const goFish = document.getElementById("go-fish");
  const goTotalFish = document.getElementById("go-total-fish");
  const btnRetry = document.getElementById("btn-retry");
  const btnGoShop = document.getElementById("btn-go-shop");

  // Shop Elements
  const shopTotalFish = document.getElementById("shop-total-fish");
  const btnCloseShop = document.getElementById("btn-close-shop");
  const tabSkins = document.getElementById("tab-skins");
  const tabTrails = document.getElementById("tab-trails");
  const gridSkins = document.getElementById("grid-skins");
  const gridTrails = document.getElementById("grid-trails");

  // Touch
  const touchControls = document.getElementById("touch-controls");
  const btnTouchLeft = document.getElementById("btn-touch-left");
  const btnTouchRight = document.getElementById("btn-touch-right");
  const btnTouchJump = document.getElementById("btn-touch-jump");

  // Optional External Images
  const IMG_SRC = {
    "cat-idle": "assets/cat-idle.png",
    "cat-run-1": "assets/cat-run-1.png",
    "cat-run-2": "assets/cat-run-2.png",
    "cat-jump": "assets/cat-jump.png",
    "cat-fall": "assets/cat-fall.png",
    "cat-hurt": "assets/cat-hurt.png",
    fish: "assets/fish.png",
    paw: "assets/paw.png",
    fishbone: "assets/obstacle-fishbone.png",
    cactus: "assets/obstacle-cactus.png",
    bird: "assets/obstacle-bird.png",
  };
  const images = {};
  Object.keys(IMG_SRC).forEach((k) => {
    const img = new Image();
    img.src = IMG_SRC[k];
    images[k] = img;
  });

  // ==========================================
  // GAME STATE & OBJECTS
  // ==========================================
  const STATE = { START: "start", PLAYING: "playing", GAMEOVER: "gameover" };
  let state = STATE.START;

  let player = null;
  let platforms = [];
  let entities = [];
  let particles = [];
  let floatingTexts = [];

  let scrollSpeed = BASE_SCROLL_SPEED;
  let elapsed = 0;
  let score = 0;
  let streak = 0;
  let fishThisRun = 0;
  let spawnTimer = 0.5;
  let platformSpawnTimer = 0.2;
  let nearMissFlash = 0;
  let timeScale = 1;

  let moveLeft = false;
  let moveRight = false;
  let jumpBuffer = 0;
  let coyoteTime = 0;

  // Background Parallax Offsets
  let bgClouds = [];
  let bgHillsOffset = 0;
  let bgGrassOffset = 0;

  function initClouds() {
    bgClouds = [];
    for (let i = 0; i < 7; i++) {
      bgClouds.push({
        x: Math.random() * WORLD_W,
        y: 30 + Math.random() * 140,
        speed: 15 + Math.random() * 25,
        w: 60 + Math.random() * 80,
        isPaw: Math.random() < 0.4,
      });
    }
  }
  initClouds();

  function resetRun() {
    player = {
      x: 180,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      w: PLAYER_W,
      h: PLAYER_H,
      onGround: true,
      jumpsLeft: 2,
      facing: 1,
      runFrame: 0,
      runTimer: 0,
      trailTimer: 0,
    };

    platforms = [];
    entities = [];
    particles = [];
    floatingTexts = [];

    scrollSpeed = BASE_SCROLL_SPEED;
    elapsed = 0;
    score = 0;
    streak = 0;
    fishThisRun = 0;
    spawnTimer = 0.8;
    platformSpawnTimer = 1.2;
    nearMissFlash = 0;
    timeScale = 1;
    jumpBuffer = 0;
    coyoteTime = 0;
  }

  function getComboMult() {
    for (const tier of COMBO_TIERS) {
      if (streak >= tier.streak) return tier.mult;
    }
    return 1;
  }

  // ==========================================
  // SPAWNING SYSTEM (Platforms, Obstacles, Collectibles)
  // ==========================================
  function spawnPlatform() {
    const heights = [GROUND_Y - 95, GROUND_Y - 170, GROUND_Y - 240];
    const y = heights[Math.floor(Math.random() * heights.length)];
    const w = 140 + Math.floor(Math.random() * 120);

    const platform = {
      x: WORLD_W + 30,
      y,
      w,
      h: 22,
      type: "cloud-wood",
    };
    platforms.push(platform);

    // Chance to spawn collectibles on the platform
    if (Math.random() < 0.8) {
      const isFish = Math.random() < 0.7;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        entities.push({
          kind: isFish ? "fish" : "paw",
          x: platform.x + 20 + i * 36,
          y: platform.y - 32,
          w: 32,
          h: 32,
          collected: false,
          baseY: platform.y - 32,
          animOff: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function spawnGroundOrAirEntity() {
    const roll = Math.random();

    if (roll < 0.52) {
      // Collectible chain (arc or wave)
      const isFish = Math.random() < 0.65;
      const count = 3 + Math.floor(Math.random() * 4);
      const baseY = GROUND_Y - 50 - Math.random() * 120;
      for (let i = 0; i < count; i++) {
        entities.push({
          kind: isFish ? "fish" : "paw",
          x: WORLD_W + 40 + i * 44,
          y: baseY + Math.sin(i * 0.8) * 35,
          w: 34,
          h: 34,
          collected: false,
          baseY: baseY + Math.sin(i * 0.8) * 35,
          animOff: i * 0.5,
        });
      }
    } else {
      // Obstacle
      const obsRoll = Math.random();
      if (obsRoll < 0.38) {
        // Cactus on ground
        entities.push({
          kind: "obstacle",
          type: "cactus",
          x: WORLD_W + 30,
          y: GROUND_Y - 58,
          w: 52,
          h: 58,
          nearMissFired: false,
        });
      } else if (obsRoll < 0.72) {
        // Fishbone on ground
        entities.push({
          kind: "obstacle",
          type: "fishbone",
          x: WORLD_W + 30,
          y: GROUND_Y - 46,
          w: 58,
          h: 46,
          nearMissFired: false,
        });
      } else if (obsRoll < 0.88) {
        // Flying Bird
        const flyY = GROUND_Y - 140 - Math.random() * 110;
        entities.push({
          kind: "obstacle",
          type: "bird",
          x: WORLD_W + 30,
          y: flyY,
          baseY: flyY,
          w: 48,
          h: 42,
          animOff: Math.random() * Math.PI * 2,
          nearMissFired: false,
        });
      } else {
        // Rolling Yarn Ball (faster rolling obstacle)
        entities.push({
          kind: "obstacle",
          type: "yarn",
          x: WORLD_W + 30,
          y: GROUND_Y - 48,
          w: 46,
          h: 46,
          rot: 0,
          speedExtra: 80,
          nearMissFired: false,
        });
      }
    }
  }

  // ==========================================
  // PARTICLES & JUICE
  // ==========================================
  function createDustPuff(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y - Math.random() * 6,
        vx: (Math.random() - 0.5) * 60 - scrollSpeed * 0.2,
        vy: -Math.random() * 50 - 20,
        size: 5 + Math.random() * 6,
        color: "#ffffff",
        alpha: 0.8,
        life: 0.35,
        maxLife: 0.35,
      });
    }
  }

  function createSparkles(x, y, color = "#ffcf40", count = 6) {
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = 60 + Math.random() * 120;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: 4 + Math.random() * 5,
        color,
        alpha: 1,
        life: 0.45,
        maxLife: 0.45,
        shape: "star",
      });
    }
  }

  function addFloatingText(text, x, y, color = "#ff8c2b", size = 20) {
    floatingTexts.push({
      text,
      x,
      y,
      vy: -60,
      color,
      size,
      alpha: 1,
      life: 0.8,
      maxLife: 0.8,
    });
  }

  // ==========================================
  // GAMEPLAY LOGIC
  // ==========================================
  function jump() {
    if (state !== STATE.PLAYING) return;
    initAudio();

    if (player.onGround || coyoteTime > 0) {
      player.vy = JUMP_IMPULSE;
      player.onGround = false;
      player.jumpsLeft = 1;
      coyoteTime = 0;
      playJumpSound(false);
      createDustPuff(player.x, player.y, 6);
    } else if (player.jumpsLeft > 0) {
      player.vy = DOUBLE_JUMP_IMPULSE;
      player.jumpsLeft = 0;
      playJumpSound(true);
      createSparkles(player.x, player.y, "#74ebd5", 8);
    } else {
      jumpBuffer = 0.12; // Buffer jump for smooth landing
    }
  }

  function startGame() {
    initAudio();
    resetRun();
    state = STATE.PLAYING;
    screenStart.classList.add("hidden");
    screenGameOver.classList.add("hidden");
    screenShop.classList.add("hidden");
    hud.classList.remove("hidden");
    startBGM();
  }

  function endGame() {
    state = STATE.GAMEOVER;
    stopBGM();
    playHitSound();

    const finalScore = Math.floor(score);
    if (finalScore > bestScore) {
      bestScore = finalScore;
    }
    totalFish += fishThisRun;
    saveGameData();

    goScore.textContent = finalScore;
    goBest.textContent = bestScore;
    goFish.textContent = fishThisRun;
    goTotalFish.textContent = totalFish;

    hud.classList.add("hidden");
    screenGameOver.classList.remove("hidden");
  }

  // ==========================================
  // UPDATE LOOP
  // ==========================================
  function update(dtRaw) {
    if (state !== STATE.PLAYING) return;

    // Time scaling for near-miss slow-mo
    const dt = dtRaw * timeScale;
    if (timeScale < 1) {
      nearMissFlash -= dtRaw;
      if (nearMissFlash <= 0) timeScale = 1;
    }

    elapsed += dt;
    scrollSpeed = Math.min(MAX_SCROLL_SPEED, BASE_SCROLL_SPEED + elapsed * SPEED_RAMP_RATE);

    // Score accumulation by survival
    score += (scrollSpeed / 100) * dt;

    // Jump buffer & Coyote time
    if (jumpBuffer > 0) jumpBuffer -= dt;
    if (!player.onGround && coyoteTime > 0) coyoteTime -= dt;

    // Horizontal Movement
    if (moveLeft) {
      player.vx = -MOVE_SPEED;
      player.facing = -1;
    } else if (moveRight) {
      player.vx = MOVE_SPEED;
      player.facing = 1;
    } else {
      player.vx = 0;
    }
    player.x += player.vx * dt;
    player.x = Math.max(PLAYER_MIN_X, Math.min(PLAYER_MAX_X, player.x));

    // Vertical Physics
    player.vy = Math.min(MAX_FALL_SPEED, player.vy + GRAVITY * dt);
    const prevY = player.y;
    player.y += player.vy * dt;

    // Platform Collision (One-way top landing)
    let landedOnPlatform = false;
    const playerFeetX = player.x;

    for (const plat of platforms) {
      const inX = playerFeetX >= plat.x - 10 && playerFeetX <= plat.x + plat.w + 10;
      const crossedTop = prevY <= plat.y && player.y >= plat.y;
      if (inX && crossedTop && player.vy >= 0) {
        player.y = plat.y;
        player.vy = 0;
        landedOnPlatform = true;
        break;
      }
    }

    // Ground Collision
    if (player.y >= GROUND_Y) {
      player.y = GROUND_Y;
      player.vy = 0;
      landedOnPlatform = true;
    }

    if (landedOnPlatform) {
      if (!player.onGround) {
        createDustPuff(player.x, player.y, 4);
      }
      player.onGround = true;
      player.jumpsLeft = 2;
      coyoteTime = 0.08;

      if (jumpBuffer > 0) {
        jumpBuffer = 0;
        jump();
      }
    } else {
      player.onGround = false;
    }

    // Run animation frames
    if (player.onGround) {
      player.runTimer += dt;
      if (player.runTimer >= 0.12) {
        player.runTimer = 0;
        player.runFrame = (player.runFrame + 1) % 2;
      }
    }

    // Trail Emitter
    player.trailTimer += dt;
    if (player.trailTimer >= 0.06) {
      player.trailTimer = 0;
      emitTrailParticle();
    }

    // Spawn Timers
    platformSpawnTimer -= dt;
    if (platformSpawnTimer <= 0) {
      spawnPlatform();
      platformSpawnTimer = 1.4 + Math.random() * 1.2;
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnGroundOrAirEntity();
      const progress = Math.min(1, elapsed / 60);
      spawnTimer = 1.3 - progress * 0.6 + Math.random() * 0.4;
    }

    // Update Background Parallax
    bgHillsOffset = (bgHillsOffset + scrollSpeed * 0.3 * dt) % WORLD_W;
    bgGrassOffset = (bgGrassOffset + scrollSpeed * dt) % 60;
    for (const cloud of bgClouds) {
      cloud.x -= (cloud.speed + scrollSpeed * 0.1) * dt;
      if (cloud.x + cloud.w < -20) {
        cloud.x = WORLD_W + 40;
        cloud.y = 30 + Math.random() * 140;
      }
    }

    // Update Platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
      const p = platforms[i];
      p.x -= scrollSpeed * dt;
      if (p.x + p.w < -60) platforms.splice(i, 1);
    }

    // Player Bounding Box
    const pBox = {
      left: player.x - player.w / 2 + 14,
      right: player.x + player.w / 2 - 14,
      top: player.y - player.h + 10,
      bottom: player.y - 4,
    };

    // Update Entities & Collisions
    for (let i = entities.length - 1; i >= 0; i--) {
      const e = entities[i];
      const extraSpd = e.speedExtra || 0;
      e.x -= (scrollSpeed + extraSpd) * dt;

      // Special obstacle movements
      if (e.type === "bird") {
        e.y = e.baseY + Math.sin(elapsed * 4 + e.animOff) * 25;
      } else if (e.type === "yarn") {
        e.rot = (e.rot || 0) - dt * 10;
      }

      // Collectible floating bob
      if (e.kind !== "obstacle") {
        e.y = e.baseY + Math.sin(elapsed * 5 + e.animOff) * 6;
      }

      // Out of bounds cleanup
      if (e.x + e.w < -60) {
        if (e.kind !== "obstacle" && !e.collected) {
          streak = 0; // Streak breaks if fish is missed
        }
        entities.splice(i, 1);
        continue;
      }

      const eBox = { left: e.x, right: e.x + e.w, top: e.y, bottom: e.y + e.h };
      const overlapX = pBox.left < eBox.right && pBox.right > eBox.left;
      const overlapY = pBox.top < eBox.bottom && pBox.bottom > eBox.top;

      if (e.kind === "obstacle") {
        if (overlapX && overlapY) {
          endGame();
          return;
        }

        // Near-Miss check
        if (!e.nearMissFired && overlapX && !player.onGround) {
          const gap = Math.min(
            Math.abs(pBox.bottom - eBox.top),
            Math.abs(eBox.bottom - pBox.top)
          );
          if (gap < NEAR_MISS_GAP) {
            e.nearMissFired = true;
            timeScale = 0.35;
            nearMissFlash = 0.35;
            playNearMissSound();
            addFloatingText("MEOW! ✨", player.x, player.y - player.h - 20, "#ff4757", 26);
            score += 25 * getComboMult();
          }
        }
      } else if (!e.collected && overlapX && overlapY) {
        // Collected Fish or Paw
        e.collected = true;
        streak++;
        const mult = getComboMult();

        if (e.kind === "fish") {
          const pts = 10 * mult;
          score += pts;
          fishThisRun++;
          playFishSound();
          createSparkles(e.x + e.w / 2, e.y + e.h / 2, "#ffbc00", 8);
          addFloatingText(`+${pts}`, e.x, e.y - 10, "#ff9a3c", 18);
        } else {
          const pts = 5 * mult;
          score += pts;
          playPawSound();
          createSparkles(e.x + e.w / 2, e.y + e.h / 2, "#ff6b8b", 6);
          addFloatingText(`+${pts}`, e.x, e.y - 10, "#ff6b8b", 16);
        }

        entities.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update Floating Texts
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) floatingTexts.splice(i, 1);
    }

    // Update HUD
    hudScore.textContent = Math.floor(score);
    hudBest.textContent = Math.max(bestScore, Math.floor(score));
    hudFish.textContent = fishThisRun;

    if (streak >= 5) {
      hudComboBadge.classList.remove("hidden");
      hudComboMult.textContent = `x${getComboMult()}`;
    } else {
      hudComboBadge.classList.add("hidden");
    }
  }

  function emitTrailParticle() {
    const startX = player.x - (player.facing * player.w) / 3;
    const startY = player.y - player.h / 2;

    if (currentTrail === "rainbow") {
      const colors = ["#ff7675", "#fdcb6e", "#ffeaa7", "#55efc4", "#74b9ff", "#a29bfe"];
      const c = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: startX,
        y: startY + (Math.random() - 0.5) * 14,
        vx: -scrollSpeed * 0.4 - Math.random() * 20,
        vy: (Math.random() - 0.5) * 20,
        size: 6 + Math.random() * 4,
        color: c,
        alpha: 0.9,
        life: 0.35,
        maxLife: 0.35,
        shape: "circle",
      });
    } else if (currentTrail === "bubble") {
      particles.push({
        x: startX,
        y: startY + (Math.random() - 0.5) * 16,
        vx: -scrollSpeed * 0.3,
        vy: -Math.random() * 40 - 10,
        size: 5 + Math.random() * 6,
        color: "#74b9ff",
        alpha: 0.8,
        life: 0.4,
        maxLife: 0.4,
        shape: "bubble",
      });
    } else if (currentTrail === "heart") {
      particles.push({
        x: startX,
        y: startY + (Math.random() - 0.5) * 10,
        vx: -scrollSpeed * 0.35,
        vy: -Math.random() * 30 - 15,
        size: 14,
        color: "#ff6b8b",
        alpha: 0.95,
        life: 0.45,
        maxLife: 0.45,
        shape: "heart",
      });
    } else {
      // Wind (Default)
      particles.push({
        x: startX,
        y: startY + (Math.random() - 0.5) * 10,
        vx: -scrollSpeed * 0.5,
        vy: 0,
        size: 3 + Math.random() * 4,
        color: "#ffffff",
        alpha: 0.5,
        life: 0.25,
        maxLife: 0.25,
        shape: "circle",
      });
    }
  }

  // ==========================================
  // PROCEDURAL CANVAS RENDERING (100% Vector Crisp)
  // ==========================================
  function render() {
    ctx.clearRect(0, 0, WORLD_W, WORLD_H);

    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
    sky.addColorStop(0, "#bae5f8");
    sky.addColorStop(0.5, "#dff3fc");
    sky.addColorStop(1, "#fef3db");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 2. Parallax Clouds & Cat Paw Clouds
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    for (const c of bgClouds) {
      if (c.isPaw) {
        drawPawCloud(c.x, c.y, c.w * 0.6);
      } else {
        drawFluffyCloud(c.x, c.y, c.w);
      }
    }

    // 3. Distant Rolling Hills (Parallax)
    ctx.fillStyle = "#a8e0b6";
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    for (let x = 0; x <= WORLD_W; x += 40) {
      const hY = GROUND_Y - 90 + Math.sin((x + bgHillsOffset) * 0.006) * 45;
      ctx.lineTo(x, hY);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fill();

    // 4. Midground Hills
    ctx.fillStyle = "#81d397";
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H);
    for (let x = 0; x <= WORLD_W; x += 30) {
      const hY = GROUND_Y - 45 + Math.sin((x + bgHillsOffset * 1.6) * 0.01) * 25;
      ctx.lineTo(x, hY);
    }
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.closePath();
    ctx.fill();

    // 5. Platforms
    for (const p of platforms) {
      drawPlatform(p.x, p.y, p.w, p.h);
    }

    // 6. Ground Surface
    ctx.fillStyle = "#63bf7d";
    ctx.fillRect(0, GROUND_Y, WORLD_W, WORLD_H - GROUND_Y);
    ctx.fillStyle = "#4ea867";
    ctx.fillRect(0, GROUND_Y, WORLD_W, 10);

    // Decorative grass blades
    ctx.fillStyle = "#85e39f";
    for (let x = -bgGrassOffset; x < WORLD_W + 40; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x + 6, GROUND_Y - 8);
      ctx.lineTo(x + 12, GROUND_Y);
      ctx.fill();
    }

    if (state === STATE.START) return;

    // 7. Render Entities (Obstacles & Collectibles)
    for (const e of entities) {
      if (e.kind === "obstacle") {
        drawObstacle(e);
      } else {
        drawCollectible(e);
      }
    }

    // 8. Render Particles
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.shape === "heart") {
        drawHeart(p.x, p.y, p.size, p.color);
      } else if (p.shape === "star") {
        drawStar(p.x, p.y, p.size, p.color);
      } else if (p.shape === "bubble") {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 9. Render Player Cat
    drawPlayerCat();

    // 10. Render Floating Texts
    for (const ft of floatingTexts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.font = `900 ${ft.size}px "Baloo 2", sans-serif`;
      ctx.fillStyle = ft.color;
      ctx.textAlign = "center";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    // Near-Miss slow-mo overlay flash
    if (nearMissFlash > 0) {
      ctx.save();
      ctx.fillStyle = "rgba(255, 235, 150, 0.18)";
      ctx.fillRect(0, 0, WORLD_W, WORLD_H);
      ctx.restore();
    }
  }

  // --- DRAWING HELPERS ---
  function drawFluffyCloud(x, y, w) {
    ctx.beginPath();
    ctx.arc(x, y, w * 0.25, 0, Math.PI * 2);
    ctx.arc(x + w * 0.25, y - w * 0.12, w * 0.28, 0, Math.PI * 2);
    ctx.arc(x + w * 0.55, y, w * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPawCloud(x, y, r) {
    ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = -1.5; i <= 1.5; i += 1) {
      const ang = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.arc(x + Math.sin(ang) * (r * 1.25), y - Math.cos(ang) * (r * 1.1), r * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPlatform(x, y, w, h) {
    ctx.save();
    // Rounded pastel wooden/stone platform with grass top
    ctx.fillStyle = "#e0c39e";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 10);
    ctx.fill();

    // Grass trim
    ctx.fillStyle = "#7ecc89";
    ctx.beginPath();
    ctx.roundRect(x, y, w, 7, [10, 10, 0, 0]);
    ctx.fill();
    ctx.restore();
  }

  function drawCollectible(e) {
    // Check if external image loaded
    const key = e.kind === "fish" ? "fish" : "paw";
    const img = images[key];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, e.x, e.y, e.w, e.h);
      return;
    }

    ctx.save();
    if (e.kind === "fish") {
      // Golden Fish Vector
      const cx = e.x + e.w / 2;
      const cy = e.y + e.h / 2;

      ctx.fillStyle = "#ffb703";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;

      // Body
      ctx.beginPath();
      ctx.ellipse(cx, cy, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tail
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx - 18, cy - 7);
      ctx.lineTo(cx - 18, cy + 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.fillStyle = "#333";
      ctx.beginPath();
      ctx.arc(cx + 6, cy - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Paw Print Vector
      const cx = e.x + e.w / 2;
      const cy = e.y + e.h / 2;

      ctx.fillStyle = "#ff85a2";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, 8, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      for (let i = -1.5; i <= 1.5; i += 1) {
        const ang = (i * Math.PI) / 5;
        ctx.beginPath();
        ctx.arc(cx + Math.sin(ang) * 10, cy - Math.cos(ang) * 8, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawObstacle(e) {
    const img = images[e.type];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, e.x, e.y, e.w, e.h);
      return;
    }

    ctx.save();
    if (e.type === "cactus") {
      ctx.fillStyle = "#69b578";
      ctx.strokeStyle = "#4d8b5a";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(e.x + 12, e.y + 4, e.w - 24, e.h - 4, 12);
      ctx.fill();
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.roundRect(e.x, e.y + 18, 14, 12, 6);
      ctx.roundRect(e.x + e.w - 14, e.y + 12, 14, 12, 6);
      ctx.fill();
      ctx.stroke();
    } else if (e.type === "fishbone") {
      ctx.fillStyle = "#f4ebd9";
      ctx.strokeStyle = "#c4b59f";
      ctx.lineWidth = 3;
      // Head
      ctx.beginPath();
      ctx.arc(e.x + e.w - 12, e.y + e.h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Spine & Ribs
      ctx.beginPath();
      ctx.moveTo(e.x + 6, e.y + e.h / 2);
      ctx.lineTo(e.x + e.w - 12, e.y + e.h / 2);
      ctx.stroke();
      for (let rx = e.x + 12; rx < e.x + e.w - 16; rx += 10) {
        ctx.beginPath();
        ctx.moveTo(rx, e.y + 4);
        ctx.lineTo(rx, e.y + e.h - 4);
        ctx.stroke();
      }
    } else if (e.type === "bird") {
      ctx.fillStyle = "#64b5f6";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(e.x + e.w / 2, e.y + e.h / 2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Wing
      ctx.fillStyle = "#90caf9";
      ctx.beginPath();
      ctx.ellipse(e.x + e.w / 2 + 4, e.y + e.h / 2 - 4, 10, 6, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // Beak
      ctx.fillStyle = "#ffb74d";
      ctx.beginPath();
      ctx.moveTo(e.x + 4, e.y + e.h / 2 - 2);
      ctx.lineTo(e.x - 4, e.y + e.h / 2);
      ctx.lineTo(e.x + 4, e.y + e.h / 2 + 3);
      ctx.closePath();
      ctx.fill();
    } else if (e.type === "yarn") {
      const cx = e.x + e.w / 2;
      const cy = e.y + e.h / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(e.rot || 0);
      ctx.fillStyle = "#ff6b8b";
      ctx.beginPath();
      ctx.arc(0, 0, e.w / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, e.w / 2 - 6, 0.4, 3.8);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawPlayerCat() {
    const skinDef = SKINS.find((s) => s.id === currentSkin) || SKINS[0];
    const cx = player.x;
    const cy = player.y - player.h / 2;

    ctx.save();
    ctx.translate(cx, cy);
    if (player.facing === -1) ctx.scale(-1, 1);

    const bodyColor = skinDef.color;
    const earColor = skinDef.earColor;

    // Bobbing / Leg stride offset
    const legOffset = player.onGround ? (player.runFrame === 0 ? 6 : -6) : 0;
    const jumpStretch = !player.onGround ? (player.vy < 0 ? -4 : 4) : 0;

    // 1. Fluffy Tail
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-18, 4);
    ctx.quadraticCurveTo(-34, -8 + Math.sin(elapsed * 12) * 6, -26, -22);
    ctx.stroke();

    // 2. Back Legs
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(-14 - legOffset, 24, 7, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(14 + legOffset, 24, 7, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3. Main Chubby Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 4 + jumpStretch, 26, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Calico Spots (if applicable)
    if (skinDef.spotColor) {
      ctx.fillStyle = skinDef.spotColor;
      ctx.beginPath();
      ctx.ellipse(8, -2, 8, 10, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Bread Costume (if bread skin)
    if (skinDef.isBread) {
      ctx.fillStyle = "#ffe8d6";
      ctx.strokeStyle = "#bc6c25";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-22, -16, 44, 40, 8);
      ctx.fill();
      ctx.stroke();
    }

    // 5. Cat Head
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(8, -12, 19, 0, Math.PI * 2);
    ctx.fill();

    // 6. Ears
    ctx.fillStyle = earColor;
    // Left ear
    ctx.beginPath();
    ctx.moveTo(-2, -24);
    ctx.lineTo(4, -36);
    ctx.lineTo(10, -26);
    ctx.closePath();
    ctx.fill();
    // Right ear
    ctx.beginPath();
    ctx.moveTo(12, -26);
    ctx.lineTo(18, -36);
    ctx.lineTo(24, -22);
    ctx.closePath();
    ctx.fill();

    // Crown (if Royal skin)
    if (skinDef.hasCrown) {
      ctx.fillStyle = "#ffd166";
      ctx.strokeStyle = "#e09f3e";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(4, -30);
      ctx.lineTo(4, -40);
      ctx.lineTo(11, -34);
      ctx.lineTo(18, -40);
      ctx.lineTo(18, -30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 7. Aviator Goggles
    ctx.fillStyle = "#5c4033";
    ctx.fillRect(0, -22, 22, 5);
    ctx.fillStyle = "#81d4fa";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(8, -20, 5, 0, Math.PI * 2);
    ctx.arc(18, -20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 8. Eyes & Cheeks
    ctx.fillStyle = "#2d3436";
    if (state === STATE.GAMEOVER) {
      // Dizzy eyes 'x'
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("x", 16, -10);
    } else {
      ctx.beginPath();
      ctx.arc(17, -11, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rosy Pink Cheeks
    ctx.fillStyle = "rgba(255, 107, 129, 0.6)";
    ctx.beginPath();
    ctx.arc(19, -6, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 9. Red Collar with Gold Bell
    ctx.fillStyle = "#ff4757";
    ctx.beginPath();
    ctx.roundRect(4, 3, 14, 5, 3);
    ctx.fill();
    ctx.fillStyle = "#ffd32a";
    ctx.beginPath();
    ctx.arc(10, 9, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawHeart(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + topCurveHeight);
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
    ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
    ctx.closePath();
    ctx.fill();
  }

  function drawStar(cx, cy, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        cx + r * Math.cos(((18 + i * 72) * Math.PI) / 180),
        cy - r * Math.sin(((18 + i * 72) * Math.PI) / 180)
      );
      ctx.lineTo(
        cx + (r / 2) * Math.cos(((54 + i * 72) * Math.PI) / 180),
        cy - (r / 2) * Math.sin(((54 + i * 72) * Math.PI) / 180)
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  // ==========================================
  // SHOP UI & MODALS
  // ==========================================
  function renderShop() {
    shopTotalFish.textContent = totalFish;

    // Render Skins Grid
    gridSkins.innerHTML = "";
    SKINS.forEach((skin) => {
      const isOwned = unlockedSkins.includes(skin.id);
      const isEquipped = currentSkin === skin.id;

      const card = document.createElement("div");
      card.className = `shop-item-card ${isEquipped ? "equipped" : ""}`;
      card.innerHTML = `
        <div class="item-preview">${skin.emoji}</div>
        <div class="item-name">${skin.name}</div>
        <button class="item-btn ${isEquipped ? "btn-equipped" : isOwned ? "btn-equip" : "btn-buy"}">
          ${isEquipped ? "Đang chọn" : isOwned ? "Chọn" : `🐟 ${skin.price}`}
        </button>
      `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (isEquipped) return;
        if (isOwned) {
          currentSkin = skin.id;
          saveGameData();
          renderShop();
        } else if (totalFish >= skin.price) {
          totalFish -= skin.price;
          unlockedSkins.push(skin.id);
          currentSkin = skin.id;
          saveGameData();
          renderShop();
        } else {
          btn.textContent = "Chưa đủ cá!";
          setTimeout(() => { renderShop(); }, 800);
        }
      });

      gridSkins.appendChild(card);
    });

    // Render Trails Grid
    gridTrails.innerHTML = "";
    TRAILS.forEach((trail) => {
      const isOwned = unlockedTrails.includes(trail.id);
      const isEquipped = currentTrail === trail.id;

      const card = document.createElement("div");
      card.className = `shop-item-card ${isEquipped ? "equipped" : ""}`;
      card.innerHTML = `
        <div class="item-preview">${trail.icon}</div>
        <div class="item-name">${trail.name}</div>
        <button class="item-btn ${isEquipped ? "btn-equipped" : isOwned ? "btn-equip" : "btn-buy"}">
          ${isEquipped ? "Đang chọn" : isOwned ? "Chọn" : `🐟 ${trail.price}`}
        </button>
      `;

      const btn = card.querySelector("button");
      btn.addEventListener("click", () => {
        if (isEquipped) return;
        if (isOwned) {
          currentTrail = trail.id;
          saveGameData();
          renderShop();
        } else if (totalFish >= trail.price) {
          totalFish -= trail.price;
          unlockedTrails.push(trail.id);
          currentTrail = trail.id;
          saveGameData();
          renderShop();
        } else {
          btn.textContent = "Chưa đủ cá!";
          setTimeout(() => { renderShop(); }, 800);
        }
      });

      gridTrails.appendChild(card);
    });
  }

  function openShop() {
    renderShop();
    screenShop.classList.remove("hidden");
  }

  function closeShop() {
    screenShop.classList.add("hidden");
    startTotalFish.textContent = totalFish;
    startBest.textContent = bestScore;
  }

  tabSkins.addEventListener("click", () => {
    tabSkins.classList.add("active");
    tabTrails.classList.remove("active");
    gridSkins.classList.remove("hidden");
    gridTrails.classList.add("hidden");
  });

  tabTrails.addEventListener("click", () => {
    tabTrails.classList.add("active");
    tabSkins.classList.remove("active");
    gridTrails.classList.remove("hidden");
    gridSkins.classList.add("hidden");
  });

  btnOpenShop.addEventListener("click", openShop);
  btnGoShop.addEventListener("click", openShop);
  btnCloseShop.addEventListener("click", closeShop);

  // Sound Toggle
  function toggleSound() {
    isMuted = !isMuted;
    localStorage.setItem("gcfc_muted", String(isMuted));
    btnSoundHud.textContent = isMuted ? "🔇" : "🔊";
    if (isMuted) stopBGM();
    else if (state === STATE.PLAYING) startBGM();
  }
  btnSoundHud.addEventListener("click", toggleSound);
  btnSoundHud.textContent = isMuted ? "🔇" : "🔊";

  // ==========================================
  // INPUT HANDLING (Keyboard & Touch)
  // ==========================================
  window.addEventListener("keydown", (e) => {
    if (["KeyA", "ArrowLeft"].includes(e.code)) moveLeft = true;
    if (["KeyD", "ArrowRight"].includes(e.code)) moveRight = true;
    if (["Space", "KeyW", "ArrowUp"].includes(e.code)) {
      e.preventDefault();
      if (state === STATE.START) startGame();
      else if (state === STATE.GAMEOVER) startGame();
      else jump();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (["KeyA", "ArrowLeft"].includes(e.code)) moveLeft = false;
    if (["KeyD", "ArrowRight"].includes(e.code)) moveRight = false;
  });

  function bindTouch(el, onDown, onUp) {
    el.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      onDown();
    });
    el.addEventListener("pointerup", (ev) => {
      ev.preventDefault();
      if (onUp) onUp();
    });
    el.addEventListener("pointerleave", () => {
      if (onUp) onUp();
    });
  }

  bindTouch(btnTouchLeft, () => (moveLeft = true), () => (moveLeft = false));
  bindTouch(btnTouchRight, () => (moveRight = true), () => (moveRight = false));
  bindTouch(btnTouchJump, () => jump());

  btnPlay.addEventListener("click", startGame);
  btnRetry.addEventListener("click", startGame);

  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
    touchControls.classList.remove("hidden");
  }

  // ==========================================
  // RESIZE & GAME LOOP
  // ==========================================
  function resize() {
    const scale = Math.min(window.innerWidth / WORLD_W, window.innerHeight / WORLD_H);
    canvas.width = WORLD_W;
    canvas.height = WORLD_H;
    canvas.style.width = `${WORLD_W * scale}px`;
    canvas.style.height = `${WORLD_H * scale}px`;
  }
  window.addEventListener("resize", resize);
  resize();

  let lastTime = 0;
  function gameLoop(t) {
    const dt = Math.min(0.033, (t - lastTime) / 1000 || 0);
    lastTime = t;
    update(dt);
    render();
    requestAnimationFrame(gameLoop);
  }

  // Initial UI state
  startBest.textContent = bestScore;
  startTotalFish.textContent = totalFish;
  requestAnimationFrame((t) => {
    lastTime = t;
    requestAnimationFrame(gameLoop);
  });
})();
