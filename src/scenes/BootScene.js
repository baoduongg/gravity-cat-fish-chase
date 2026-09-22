class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    window.GCFCTextures.generateAll(this);
    this.scene.start("Home");
  }
}
