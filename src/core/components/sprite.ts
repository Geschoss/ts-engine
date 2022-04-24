import { isDefined, pickOr } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { Sprite } from '../graphics/sprite';
import { Vector3 } from '../math/vector3';
import { BaseComponent } from './base';

export class SpriteComponentData implements IComponentData {
  name!: string;
  materialName!: string;
  origin: Vector3 = Vector3.zero();

  setFromJson(json: any) {
    this.name = pickOr('', 'name', json);
    this.materialName = pickOr('', 'materialName', json);

    let origin = json.origin;
    if (isDefined(origin)) {
      this.origin.setFromJson(origin);
    }
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
    if (!data.origin.equals(Vector3.zero())) {
      this.sprite.origin.copyFrom(data.origin);
    }
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
