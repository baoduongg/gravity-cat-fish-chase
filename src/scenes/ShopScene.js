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
