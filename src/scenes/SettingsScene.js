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
      if (stateKey === "bgmEnabled" && !this.state[stateKey]) {
        window.GCFCAudio.stopBGM();
      }
    });
  }
}
