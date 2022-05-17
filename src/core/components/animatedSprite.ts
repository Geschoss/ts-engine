import { isDefined } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { AnimatedSprite } from '../graphics/animatedSprite';
import { Vector3 } from '../math/vector3';
import { BaseComponent } from './base';
import { SpriteComponentData } from './sprite';

export class AnimatedSpriteComponentData
  extends SpriteComponentData
  implements IComponentData
{
  frameTime!: number;
  frameWidth!: number;
  frameCount!: number;
  frameHeight!: number;
  frameSequence: number[] = [];
  autoPlay = true;

  setFromJson(json: any) {
    super.setFromJson(json);

    let autoPlay = json.autoPlay;
    if (isDefined(autoPlay)) {
      this.autoPlay = autoPlay;
    }

    let frameWidth = json.frameWidth;
    if (!isDefined(frameWidth))
      throw new Error('AnimatedSpriteComponentData rquires frameWidth');
    this.frameWidth = Number(frameWidth);

    let frameHeight = json.frameHeight;
    if (!isDefined(frameHeight))
      throw new Error('AnimatedSpriteComponentData rquires frameHeight');
    this.frameHeight = Number(frameHeight);

    let frameCount = json.frameCount;
    if (!isDefined(frameCount))
      throw new Error('AnimatedSpriteComponentData rquires frameCount');
    this.frameCount = Number(frameCount);

    let frameSequence = json.frameSequence;
    if (!isDefined(frameSequence))
      throw new Error('AnimatedSpriteComponentData rquires frameSequence');
    this.frameSequence = frameSequence;

    let frameTime = json.frameTime;
    if (isDefined(frameTime)) {
      this.frameTime = frameTime;
    }
  }
}

export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
  type = 'animatedSprite';
  buildFromJson(json: any): IComponent {
    let data = new AnimatedSpriteComponentData();
    data.setFromJson(json);
    return new AnimatedSpriteComponent(data);
  }
}

export class AnimatedSpriteComponent extends BaseComponent {
  sprite: AnimatedSprite;
  autoPlay!: boolean;

  constructor(data: AnimatedSpriteComponentData) {
    super(data);
    this.autoPlay = data.autoPlay;
    this.sprite = new AnimatedSprite(
      data.name,
      data.materialName,
      data.frameWidth,
      data.frameHeight,
      data.frameWidth,
      data.frameHeight,
      data.frameCount,
      data.frameSequence,
      data.frameTime
    );
    if (!data.origin.equals(Vector3.zero())) {
      this.sprite.origin.copyFrom(data.origin);
    }
  }
  isPlaying() {
    return this.sprite.isPlaying;
  }
  updateReady(): void {
    if (!this.autoPlay) {
      this.sprite.stop();
    }
  }
  load() {
    this.sprite.load();
    super.load();
  }
  update(time: number) {
    this.sprite.update(time);
    super.update(time);
  }
  render(shader: Shader) {
    this.sprite.draw(shader, this.owner.worldMatrix);

    super.render(shader);
  }
  play() {
    this.sprite.play();
  }
  stop() {
    this.sprite.stop();
  }
  setFrame(frameNumber: number) {
    this.sprite.setFrame(frameNumber);
  }
}
