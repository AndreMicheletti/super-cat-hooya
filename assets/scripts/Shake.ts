import { getTimescale } from "./TimeHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ParallaxBG extends cc.Component {
  @property()
  public intensity = 1;

  @property()
  public frequency = 60;

  private timer = 0;

  protected start(): void {
    this.timer = 0;
  }

  protected update(dt: number): void {
    const freq = this.frequency / getTimescale();
    if (this.timer >= freq) {
      const intensity = this.intensity * getTimescale() * 0.9;
      const shakeX = (0.5 - Math.random()) * intensity;
      const shakeY = (0.5 - Math.random()) * intensity;
      this.timer = 0;
      cc.tween(this.node).to(freq * 0.85, { x: shakeX, y: shakeY }, { easing: cc.easing.cubicOut }).start();
    } else this.timer += dt;
  }
}
