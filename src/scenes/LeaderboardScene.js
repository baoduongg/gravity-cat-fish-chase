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
