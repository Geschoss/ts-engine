import { pickOr } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { Sprite } from '../graphics/sprite';
import { BaseComponent } from './base';

export class SpriteComponentData implements IComponentData {
  name!: string;
  materialName!: string;

  setFromJson(json: any) {
    this.name = pickOr('', 'name', json);
    this.materialName = pickOr('', 'materialName', json);
  }
}

export class SpriteComponentBuilder implements IComponentBuilder {
  type = 'sprite';
  buildFromJson(json: any): IComponent {
    let data = new SpriteComponentData();
    data.setFromJson(json);
    return new SpriteComponent(data);
  }
}

export class SpriteComponent extends BaseComponent {
  sprite: Sprite;
  constructor(data: SpriteComponentData) {
    super(data);
    this.sprite = new Sprite(data.name, data.materialName);
  }
  load() {
    this.sprite.load();
    super.load();
  }
  render(shader: Shader) {
    this.sprite.draw(shader, this.owner.worldMatrix);

    super.render(shader);
  }
}
