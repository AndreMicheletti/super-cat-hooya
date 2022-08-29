import { getTimescale, setTimescale } from "./TimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Cat2 extends cc.Component {
  @property(cc.Node)
  public canvas: cc.Node = null;

  @property(cc.Camera)
  public camera: cc.Camera = null;

  @property(cc.Sprite)
  public splash: cc.Sprite = null;

  @property(cc.Sprite)
  public screenFlash: cc.Sprite = null;

  @property(dragonBones.ArmatureDisplay)
  public effect1: dragonBones.ArmatureDisplay = null;

  @property(dragonBones.ArmatureDisplay)
  public effect2: dragonBones.ArmatureDisplay = null;

  @property(dragonBones.ArmatureDisplay)
  public effect3: dragonBones.ArmatureDisplay = null;

  private spine: dragonBones.ArmatureDisplay = null;

  private level = 0;

  protected onLoad(): void {
    this.spine = this.node.getComponent(dragonBones.ArmatureDisplay);
    // this.canvas.on(cc.Node.EventType.MOUSE_UP, () => {
    //   this.increaseLevel();
    // });
  }

  protected start(): void {
    this.effect1.armatureName = 'effect1'
    this.effect2.armatureName = 'effect2'
    this.effect3.armatureName = 'effect3'
  }

  public resetLevel(): void {
    this.cameraZoom(1);
    setTimescale(1);
    this.effect1.node.active = false;
    this.effect2.node.active = false;
    this.effect3.node.active = false;
    this.spine.timeScale = 0.8 * getTimescale();
    this.level = 0;
  }

  public increaseLevel(): void {
    this.level += 1;
    let node = null;
    switch (this.level) {
      case 1:
        node = this.effect1.node;
        node.active = true;
        this.effectEnterTween(node).start();
        this.effect1.playAnimation('effect1', 0);
        this.activateSplash(cc.Color.GREEN);
        this.makeScreenFlash(cc.Color.GREEN);
        this.cameraZoom(1.1);
        setTimescale(1.5);
        break;
      case 2:
        node = this.effect2.node;
        node.active = true;
        this.effectEnterTween(this.effect1.node).start();
        this.effect2.playAnimation('effect2', 0);
        this.activateSplash(cc.Color.BLUE);
        this.makeScreenFlash(cc.Color.BLUE);
        this.cameraZoom(1.2);
        setTimescale(2);
        break;
      case 3:
        node = this.effect3.node;
        node.active = true;
        this.effect1.node.active = false;
        this.effect2.node.active = false;
        this.effectEnterTween(node, 1.3).start();
        this.effect3.playAnimation('effect3', 0);
        this.activateSplash(cc.Color.YELLOW);
        this.makeScreenFlash(cc.Color.YELLOW);
        this.cameraZoom(1.4);
        setTimescale(3);
        break;
      case 4:
        this.spine.armatureName = 'jump';
        this.spine.playAnimation('jump', 0);
        cc.tween(this.node)
          .parallel(
            cc.tween(this.node).to(2, { y: 60 }, { easing: cc.easing.quintOut }),
            cc.tween(this.node).to(2, { scale: 4 })
          )
          .start();
        break;
    }
    this.spine.timeScale = 0.8 * getTimescale();
  }

  protected effectEnterTween(node: cc.Node, power = 1): cc.Tween {
    node.scale = 0;
    return cc.tween(node)
      .to(0.2, { scaleX: 2 * power, scaleY: 1.8 * power }, { easing: cc.easing.cubicIn })
      .to(1, { scaleX: 1, scaleY: 1 }, { easing: cc.easing.quintOut });
  }

  protected cameraZoom(newZoom: number): void {
    cc.tween(this.camera).to(0.5, { zoomRatio: newZoom }, { easing: cc.easing.elasticOut }).start();
  }

  protected makeScreenFlash(color: cc.Color): void {
    this.screenFlash.node.parent.width = 0;
    this.screenFlash.node.parent.height = 0;
    this.screenFlash.node.color = color;
    cc.tween(this.screenFlash.node)
      .to(0.2, { opacity: 200 }, { easing: cc.easing.cubicOut })
      .to(0.4, { opacity: 0 }, { easing: cc.easing.cubicIn })
      .start();
    cc.tween(this.screenFlash.node.parent)
      .to(0.6, { width: 600, height: 600 }, { easing: cc.easing.cubicOut })
      .start();
  }

  protected activateSplash(color: cc.Color): void {
    this.splash.node.color = color;
    this.splash.node.opacity = 0;
    this.splash.node.active = true;
    cc.tween(this.splash.node)
      .to(0.2, { opacity: 255 }, { easing: cc.easing.cubicIn })
      .to(0.2, { opacity: 0 }, { easing: cc.easing.cubicOut })
      .call(() => this.splash.node.active = false)
      .start();
  }
}
