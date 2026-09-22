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
      const state = window.GCFCStorage.load();
      if (state.bgmEnabled) window.GCFCAudio.startBGM(state.bgmVolume);
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
