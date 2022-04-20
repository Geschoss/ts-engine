import { isDefined } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { AnimatedSprite } from '../graphics/animatedSprite';
import { BaseComponent } from './base';
import { SpriteComponentData } from './sprite';

export class AnimatedSpriteComponentData
  extends SpriteComponentData
  implements IComponentData
{
  frameWidth!: number;
  frameCount!: number;
  frameHeight!: number;
  frameSequence: number[] = [];

  setFromJson(json: any) {
    super.setFromJson(json);

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
  constructor(data: AnimatedSpriteComponentData) {
    super(data);
    this.sprite = new AnimatedSprite(
      data.name,
      data.materialName,
      data.frameWidth,
      data.frameHeight,
      data.frameWidth,
      data.frameHeight,
      data.frameCount,
      data.frameSequence
    );
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
}
