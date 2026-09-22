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
