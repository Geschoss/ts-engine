import { isDefined, pickOr } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { Sprite } from '../graphics/sprite';
import { Vector3 } from '../math/vector3';
import { BaseComponent } from './base';

export class SpriteComponentData implements IComponentData {
  name!: string;
  width!: number;
  height!: number;
  materialName!: string;
  origin: Vector3 = Vector3.zero();

  setFromJson(json: any) {
    this.name = pickOr('', 'name', json);
    this.width = pickOr(0, 'width', json);
    this.height = pickOr(0, 'height', json);
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
  width: number;
  height: number;
  constructor(data: SpriteComponentData) {
    super(data);
    this.width = data.width;
    this.height = data.height;
    this.sprite = new Sprite(
      data.name,
      data.materialName,
      this.width,
      this.height
    );
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
