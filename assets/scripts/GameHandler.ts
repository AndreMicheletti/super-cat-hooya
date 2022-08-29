import Cat2 from "./Cat2";
import MusicHandler from "./MusicHandler";
import ParallaxBG from "./ParallaxBG";
import QuickButton, { QuickButtonSignal } from "./QuickButton";

const { ccclass, property } = cc._decorator;

const LIFES = 2;

export enum GameSignals {
  GameOver = 'GAME_OVER'
}

@ccclass
export default class GameHandler extends cc.Component {
  static instance: GameHandler = null;

  protected running = false;

  @property(cc.Node)
  public gameArea: cc.Node = null;

  @property(cc.Node)
  public explodeArea: cc.Node = null;

  @property(cc.Node)
  public clickAnywhere: cc.Node = null;

  @property(ParallaxBG)
  public groundParallax: ParallaxBG = null;

  @property(Cat2)
  public cat: Cat2 = null;

  @property()
  public btnFrequency = 1;

  @property()
  public btnTime = 1;

  @property(cc.Prefab)
  public btnPrefab: cc.Prefab = null;

  @property(cc.Prefab)
  public explodePrefab: cc.Prefab = null;

  private timer = 0;

  private lost = 0;

  private levelUpTween: cc.Tween = null;

  protected onLoad(): void {
    GameHandler.instance = this;
    Howler.autoSuspend = true;
    Howler.autoUnlock = true;
    cc.game.on(cc.game.EVENT_HIDE, () => Howler.ctx?.suspend());
    cc.game.on(cc.game.EVENT_SHOW, () => Howler.ctx?.resume());
  }

  protected start(): void {
    // this.startGame();
    // this.spawnExplosion();
    this.activateClickAnywhere();
  }

  protected activateClickAnywhere(): void {
    this.clickAnywhere.active = true;
    MusicHandler.instance.playIntro();
    cc.Canvas.instance.node.once(cc.Node.EventType.TOUCH_START, this.onClickAnywhere.bind(this), this, true);
  }

  protected deactivateClickAnywhere(): void {
    MusicHandler.instance.stopIntro();
    cc.Canvas.instance.node.off(cc.Node.EventType.TOUCH_START, this.onClickAnywhere.bind(this), this, true);
    this.clickAnywhere.active = false;
  }

  protected update(dt: number) {
    if (!this.running) return;
    if (this.timer >= this.btnFrequency) this.spawnButton();
    else this.timer += dt;
  }

  public startGame(): void {
    if (this.running) return;
    this.running = true;
    this.lost = 0;
    this.timer = 0;
    this.deactivateClickAnywhere();
    this.btnFrequency = 1;
    this.btnTime = 1;
    const scene = cc.director.getScene();
    scene.on(QuickButtonSignal.Win, this.onWinBtn.bind(this));
    scene.on(QuickButtonSignal.Lose, this.onLostBtn.bind(this));
    MusicHandler.instance.startGame();
    this.startLevelUp();
  }

  protected startLevelUp(): void {
    this.levelUpTween = cc.tween(this.node)
      .delay(2.6)
      .call(() => {
        this.cat.increaseLevel();
        this.btnFrequency = 0.6;
        this.btnTime = 0.8;
      })
      .delay(3)
      .call(() => {
        this.cat.increaseLevel();
        this.btnFrequency = 0.4;
        this.btnTime = 0.7;
      })
      .delay(4.2)
      .call(() => {
        this.cat.increaseLevel();
        this.btnFrequency = 0.3;
        this.btnTime = 0.5;
      })
      .delay(3.5)
      .call(() => {
        MusicHandler.instance.rampUpScrem();
        this.spawnExplosion();
        this.cat.increaseLevel();
        this.groundParallax.active = false;
        this.gameOver(true);
      })
      .start();
  }

  protected onWinBtn(): void {
    if (!this.running) return;
    this.lost = 0;
  }

  protected onLostBtn(): void {
    if (!this.running) return;
    this.lost += 1;
    if (this.lost >= LIFES) this.gameOver();
  }

  protected gameOver(won = false): void {
    if (!this.running) return;
    this.running = false;
    this.levelUpTween.stop();
    const scene = cc.director.getScene();
    scene.off(QuickButtonSignal.Win, this.onWinBtn.bind(this));
    scene.off(QuickButtonSignal.Lose, this.onLostBtn.bind(this));
    this.gameArea.children.forEach((node) => {
      const quickButton = node.getComponent(QuickButton);
      won ? quickButton?.winQuickButton() : quickButton?.loseQuickButton();
    });
    if (!won) {
      scene.emit(GameSignals.GameOver);
      MusicHandler.instance.stopGame();
      this.cat.resetLevel();
      this.levelUpTween.stop();
      setTimeout(() => this.activateClickAnywhere(), 1000);
    }
  }

  protected onClickAnywhere(): void {
    if (this.running) return;
    if (!Howler.ctx) return;
    else Howler.ctx.resume();
    setTimeout(() => {
      this.startGame();
    }, 100);
  }

  protected spawnButton(): void {
    if (!this.running) return;
    this.timer = 0;
    const { width, height } = this.gameArea;
    const node = cc.instantiate(this.btnPrefab);
    const x = (width / 2) - Math.random() * width;
    const y = (height / 2) - Math.random() * height;
    node.setPosition(x, y);
    const quickButton = node.getComponent(QuickButton);
    quickButton.time = this.btnTime;
    this.gameArea.addChild(node);
  }

  protected spawnExplosion(delay = 300): void {
    console.log(' spawnExplosion');
    const { width, height } = this.gameArea;
    const node = cc.instantiate(this.explodePrefab);
    const x = (width / 2) - Math.random() * width;
    const y = (height / 2) - Math.random() * height;
    node.setPosition(x, y);
    this.explodeArea.addChild(node);
    cc.tween(node)
      .to(0.3, { scale: 1 })
      .to(0.7, { scale: 3, opacity: 0 }, { easing: cc.easing.cubicOut })
      .call(() => node.destroy)
      .start();
    setTimeout(() => this.spawnExplosion(delay > 50 ? delay - 10 : 50), delay);
  }
}