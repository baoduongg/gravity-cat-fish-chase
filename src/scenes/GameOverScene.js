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
