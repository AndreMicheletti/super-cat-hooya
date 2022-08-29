import { Howl } from "howler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicHandler extends cc.Component {
  static instance: MusicHandler = null;

  @property(cc.AudioClip)
  public hooyaClip: cc.AudioClip = null;

  @property(cc.AudioClip)
  public rockClip: cc.AudioClip = null;

  public hooya: Howl = null;

  public rock: Howl = null;

  private rockTween: cc.Tween = null;

  protected onLoad(): void {
    MusicHandler.instance = this;
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