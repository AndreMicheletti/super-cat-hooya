import { getTimescale } from "./TimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ParallaxBG extends cc.Component {
  @property()
  public speed = 1;

  @property()
  public parallaxWidth = 480;

  public active = true;

  private sprites: Array<cc.Sprite> = [];

  // LIFE-CYCLE CALLBACKS:

  protected onLoad(): void {
    this.sprites = this.node.children.map((node) => node.getComponent(cc.Sprite)).filter((sprite) => sprite !== null);
  }

  protected start(): void {
    // this.startTweens();
  }

  protected update(dt: number): void {
    this.sprites.forEach((sprite) => {
      const node = sprite.node;
      const { x, y } = node.getPosition();
      if (x <= -this.parallaxWidth) {
        if (this.active) node.setPosition(this.parallaxWidth, y);
      } else node.setPosition(x - (this.speed * dt * getTimescale()), y);
    });
  }

  protected startTweens(): void {
    const { speed, parallaxWidth } = this;
    const moveTween = (node: cc.Node) => cc.tween(node).by(speed, { x: -parallaxWidth });
    this.sprites.forEach((sprite) => {
      const node = sprite.node;
      const { x, y } = node.position;
      const repeatTween = cc.tween(node).then(moveTween(node)).call(() => {
        if (node.getPosition().x <= -parallaxWidth) node.setPosition(parallaxWidth, y);
      });
      cc.tween(node).repeatForever(repeatTween).start();
    });
  }
}
