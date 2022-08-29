const { ccclass, property } = cc._decorator;

@ccclass
export default class Cat extends cc.Component {
  @property(cc.Node)
  public canvas: cc.Node = null;

  @property(cc.Sprite)
  public splash: cc.Sprite = null;

  @property(sp.Skeleton)
  public effect1: sp.Skeleton = null;

  @property(sp.Skeleton)
  public effect2: sp.Skeleton = null;

  @property(sp.Skeleton)
  public effect3: sp.Skeleton = null;

  private spine: sp.Skeleton = null;

  private effect = 0;

  protected onLoad(): void {
    // this.spine = this.node.getComponent(sp.Skeleton);
    // this.canvas.on(cc.Node.EventType.MOUSE_UP, () => {
    //   this.activateEffect();
    // });
  }

  protected start(): void {

  }

  protected activateEffect(): void {
    this.effect += 1;
    let node = null;
    switch (this.effect) {
      case 1:
        node = this.effect1.node;
        node.active = true;
        this.effectEnterTween(node).start();
        this.effect1.setAnimation(0, 'effect1', true);
        this.activateSplash(cc.Color.GREEN);
        this.spine.timeScale = 0.8;
        break;
      case 2:
        node = this.effect2.node;
        node.active = true;
        this.effectEnterTween(this.effect1.node).start();
        this.effect2.setAnimation(0, 'effect2', true);
        this.activateSplash(cc.Color.BLUE);
        this.spine.timeScale = 1.2;
        break;
      case 3:
        node = this.effect3.node;
        node.active = true;
        this.effect1.node.active = false;
        this.effect2.node.active = false;
        this.effectEnterTween(node, 1.3).start();
        this.effect3.setAnimation(0, 'effect3', true);
        this.activateSplash(cc.Color.YELLOW);
        this.spine.timeScale = 2;
        break;
    }
  }

  protected effectEnterTween(node: cc.Node, power = 1): cc.Tween {
    node.scale = 0;
    return cc.tween(node)
      .to(0.2, { scaleX: 2 * power, scaleY: 1.8 * power }, { easing: cc.easing.cubicIn })
      .to(1, { scaleX: 1, scaleY: 1 }, { easing: cc.easing.quintOut });
  }

  protected activateSplash(color: cc.Color): void {
    this.splash.node.color = color;
    this.splash.node.opacity = 0;
    this.splash.node.active = true;
    cc.tween(this.splash.node)
      .to(0.4, { opacity: 255 }, { easing: cc.easing.cubicIn })
      .to(0.2, { opacity: 0 }, { easing: cc.easing.cubicOut })
      .call(() => this.splash.node.active = false)
      .start();
  }
}
