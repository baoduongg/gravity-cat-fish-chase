class PlayScene extends Phaser.Scene {
  constructor() {
    super("Play");
  }

  create() {
    const cfg = window.GCFC_CONFIG;
    this.state = window.GCFCStorage.load();

    // Defensive reset: if a near-miss slow-mo is interrupted by a game-over,
    // its delayedCall (which restores timeScale to 1) never fires, since
    // this.time is destroyed along with the scene before it can run. Reset
    // both scales here so a new Play session always starts at normal speed,
    // regardless of how the previous session ended (this also covers
    // scene.restart(), which reuses the same scene/world instance).
    this.time.timeScale = 1;
    this.physics.world.timeScale = 1;

    window.GCFCAudio.resumeContext();
    if (this.state.bgmEnabled) window.GCFCAudio.startBGM(this.state.bgmVolume);

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

    const touchControls = document.getElementById("touch-controls");
    if (touchControls && ("ontouchstart" in window || navigator.maxTouchPoints > 0)) {
      touchControls.classList.remove("hidden");
    }

    this._touchHandlers = [];
    const bindHoldButton = (id, onDown, onUp) => {
      const el = document.getElementById(id);
      if (!el) return;
      const downHandler = (e) => { e.preventDefault(); onDown(); };
      const upHandler = (e) => { e.preventDefault(); onUp(); };
      const leaveHandler = () => onUp();
      el.addEventListener("pointerdown", downHandler);
      el.addEventListener("pointerup", upHandler);
      el.addEventListener("pointerleave", leaveHandler);
      this._touchHandlers.push({ el, downHandler, upHandler, leaveHandler });
    };
    bindHoldButton("btn-left", () => (this.moveLeftHeld = true), () => (this.moveLeftHeld = false));
    bindHoldButton("btn-right", () => (this.moveRightHeld = true), () => (this.moveRightHeld = false));
    bindHoldButton("btn-jump", () => (this.jumpPressed = true), () => {});

    this.input.keyboard.on("keydown-SPACE", () => (this.jumpPressed = true));
    this.input.keyboard.on("keydown-UP", () => (this.jumpPressed = true));
    this.input.keyboard.on("keydown-W", () => (this.jumpPressed = true));
    this.input.keyboard.on("keydown-ESC", () => this.togglePause());

    this.elapsed = 0;
    this.scrollSpeed = cfg.BASE_SCROLL_SPEED;
    this.obstacles = this.add.group();
    this.platforms = this.add.group();
    this.nextSpawnIn = 1.2;
    this.gameOverFired = false;

    this.groundHazardTypes = ["obstacle-fishbone", "obstacle-cactus", "obstacle-yarn"];

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

    this.events.on("shutdown", () => {
      // Stop BGM whenever Play is actually left (pause, retry, home, etc.),
      // not just on game-over.
      window.GCFCAudio.stopBGM();

      // Remove the DOM touch-button listeners bound above so repeated
      // scene.start("Play") calls don't stack duplicate handlers.
      (this._touchHandlers || []).forEach(({ el, downHandler, upHandler, leaveHandler }) => {
        el.removeEventListener("pointerdown", downHandler);
        el.removeEventListener("pointerup", upHandler);
        el.removeEventListener("pointerleave", leaveHandler);
      });
      this._touchHandlers = [];

      // Re-hide the touch controls so they don't bleed into other scenes.
      const touchControls = document.getElementById("touch-controls");
      if (touchControls) touchControls.classList.add("hidden");
    });
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
  }

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

  togglePause() {
    this.registry.set("fishThisRun", this.fishThisRun);
    window.GCFCAudio.stopBGM();
    this.scene.pause();
    this.scene.launch("Pause");
  }

  gameOver() {
    if (this.gameOverFired) return;
    this.gameOverFired = true;
    if (window.GCFCAudio && this.state.sfxEnabled) window.GCFCAudio.playCollide(this.state.sfxVolume);
    if (window.GCFCAudio) window.GCFCAudio.stopBGM();
    this.registry.set("fishThisRun", this.fishThisRun);
    this.scene.start("GameOver", { score: Math.floor(this.score || 0) });
  }
}
