import { Howl } from "howler";
import { GameSignals } from "./GameHandler";
import { QuickButtonSignal } from "./QuickButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicHandler extends cc.Component {
  static instance: MusicHandler = null;

  @property(cc.AudioClip)
  public introLoopClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public hooyaClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public rockClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public loseClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public loseAllClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public winClip: cc.AudioClip = null;

  public introLoop: Howl = null;

  public hooya: Howl = null;

  public rock: Howl = null;

  public lose: Howl = null;

  public loseAll: Howl = null;

  public win: Howl = null;

  private rockTween: cc.Tween = null;

  protected onLoad(): void {
    MusicHandler.instance = this;
    this.createSounds();
    const scene = cc.director.getScene();
    scene.on(GameSignals.GameOver, () => this.loseAll.play());
    scene.on(QuickButtonSignal.Lose, () => this.lose.play());
    scene.on(QuickButtonSignal.Win, () => this.win.play());
  }

  protected createSounds(): void {
    this.introLoop = new Howl({
      src: [this.introLoopClip.nativeUrl],
      volume: 1,
      loop: true,
      html5: true,
    });
    this.hooya = new Howl({
      src: [this.hooyaClip.nativeUrl],
      volume: 0.8,
      html5: true,
    });
    this.rock = new Howl({
      src: [this.rockClip.nativeUrl],
      volume: 1,
      html5: true,
    });
    this.lose = new Howl({
      src: [this.loseClip.nativeUrl],
      volume: 0.5,
      html5: true,
    });
    this.loseAll = new Howl({
      src: [this.loseAllClip.nativeUrl],
      volume: 0.5,
      html5: true,
    });
    this.win = new Howl({
      src: [this.winClip.nativeUrl],
      volume: 0.5,
      html5: true,
    });
  }

  public playIntro(): void {
    this.introLoop.off('fade');
    this.introLoop.volume(1);
    this.introLoop.play();
  }

  public stopIntro(): void {
    this.introLoop.fade(1, 0, 2500);
    this.introLoop.once('fade', () => this.introLoop.stop());
  }

  public startGame(): void {
    this.hooya.play();
    this.rockTween = cc.tween(this.node).delay(1.5).call(() => {
      this.rock.seek(74);
      this.rock.fade(0, 1, 1000).play();
    }).start();
  }

  public rampUpScrem(): void {
    this.hooya.volume(1);
  }

  public stopGame(): void {
    this.hooya.stop();
    this.rockTween.stop();
    this.rock.stop();
  }
}