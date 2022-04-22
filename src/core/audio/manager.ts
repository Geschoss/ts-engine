import { isDefined } from '../../lib/ramda';

export class SoundEffect {
  player: HTMLAudioElement;
  constructor(assetPath: string, loop: boolean) {
    this.player = new Audio(assetPath);
    this.player.loop = loop;
  }
  get loop() {
    return this.player.loop;
  }
  set loop(value: boolean) {
    this.player.loop = value;
  }
  play() {
    if (!this.player.paused) {
      this.stop();
    }
    this.player.play();
  }
  pause() {
    this.player.pause();
  }
  stop() {
    this.player.pause();
    this.player.currentTime = 0;
  }
  destroy() {
    // @ts-ignore
    this.player = undefined;
  }
}
export class AudioManager {
  private static soundEffects: Record<string, SoundEffect> = {};
  static loadSoundFile(name: string, assetPath: string, loop: boolean = false) {
    AudioManager.soundEffects[name] = new SoundEffect(assetPath, loop);
  }
  static playSound(name: string) {
    AudioManager.findSoundEffect(name).play();
  }
  static stopSound(name: string) {
    AudioManager.findSoundEffect(name).stop();
  }
  static pauseSound(name: string) {
    AudioManager.findSoundEffect(name).pause();
  }
  static pauseAll() {
    for (let soundName in AudioManager.soundEffects) {
      AudioManager.soundEffects[soundName].pause();
    }
  }
  static stopAll() {
    for (let soundName in AudioManager.soundEffects) {
      AudioManager.soundEffects[soundName].stop();
    }
  }

  private static findSoundEffect(name: string) {
    let soundEffect = AudioManager.soundEffects[name];
    if (!isDefined(soundEffect)) {
      throw new Error(`Cannot find sound effect by name ${name}`);
    }
    return soundEffect;
  }
}
