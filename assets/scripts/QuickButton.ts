const { ccclass, property } = cc._decorator;

export enum QuickButtonSignal {
  Win = 'WIN',
  Lose = 'LOSE',
}

@ccclass
export default class QuickButton extends cc.Component {
  @property()
  public time = 1;

  @property(cc.Sprite)
  public activeSprite: cc.Sprite = null;

  @property(cc.Sprite)
  public wonSprite: cc.Sprite = null;


  private active = false;

  private won = false;

  private tween: cc.Tween = null;

  protected onLoad(): void {
    this.node.scale = 0.5;
    this.startQuickButton(this.time);
  }

  public startQuickButton(time: number): void {
    this.time = time;
    this.active = true;
    this.tween = cc.tween(this.node)
      .to(0.3, { scale: 1.2 }, { easing: cc.easing.cubicOut })
      .call(() =>
        this.node.on(cc.Node.EventType.MOUSE_UP, this.winQuickButton.bind(this))
      )
      .delay(time * 0.9)
      .to(time * 0.1, { scale: 0.4 }, { easing: cc.easing.cubicIn })
      .call(() => this.loseQuickButton())
      .start();
  }

  public winQuickButton(): void {
    if (!this.active || this.won) return;
    console.log('WIN CLICK BUTTON');
    this.active = false;
    this.won = true;
    this.wonSprite.node.opacity = 255;
    cc.tween(this.activeSprite.node).to(0.1, { opacity: 1 }, { easing: cc.easing.circOut }).start();
    cc.director.getScene().emit(QuickButtonSignal.Win);
    this.tween.stop();
    this.tween = cc.tween(this.node)
      .to(0.4, { scale: 5, opacity: 0 }, { easing: cc.easing.cubicIn })
      .call(() => this.node.destroy())
      .start();
  }

  public loseQuickButton(): void {
    if (this.won || !this.active) return;
    this.active = false;
    this.won = false;
    this.node.off(cc.Node.EventType.MOUSE_DOWN, this.winQuickButton.bind(this));
    cc.director.getScene().emit(QuickButtonSignal.Lose);
    this.tween.stop();
    this.tween = cc.tween(this.node)
      .to(0.3, { scale: 0 }, { easing: cc.easing.backIn })
      .call(() => this.node.destroy())
      .start();
  }

  protected start(): void {

  }
}