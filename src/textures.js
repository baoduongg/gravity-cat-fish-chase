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
