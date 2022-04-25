import { isDefined, pickOr } from '../../lib/ramda';
import { CollisionManager } from '../collision/manager';
import { Shader } from '../gl/shaders/shader';
import { Circle2D } from '../graphics/shape2D/cirlce2D';
import { IShape2D } from '../graphics/shape2D/global';
import { Rectangle2D } from '../graphics/shape2D/rectangle2D';
import { BaseComponent } from './base';

export class CollisionComponentData implements IComponentData {
  name!: string;
  shape!: IShape2D;

  setFromJson(json: any) {
    this.name = pickOr('', 'name', json);

    let shape = json.shape;
    if (!isDefined(origin)) {
      throw new Error("CollisionComponentData requires 'shape' to be preset.");
    }
    if (!isDefined(shape.type)) {
      throw new Error("CollisionComponentData requires 'type' to be preset.");
    }
    let type = String(shape.type).toLocaleLowerCase();
    switch (type) {
      case 'rectangle':
        this.shape = new Rectangle2D();
        break;
      case 'circle':
        this.shape = new Circle2D();
        break;
      default:
        throw new Error(`Unsupported ahape type: ${type}`);
    }
    this.shape.setFromJson(shape);
  }
}

export class CollisionComponentBuilder implements IComponentBuilder {
  type = 'collision';
  buildFromJson(json: any): IComponent {
    let data = new CollisionComponentData();
    data.setFromJson(json);
    return new CollisionComponent(data);
  }
}

export class CollisionComponent extends BaseComponent {
  shape: IShape2D;
  constructor(data: CollisionComponentData) {
    super(data);
    this.shape = data.shape;
  }
  render(shader: Shader) {
    super.render(shader);
  }

  load() {
    super.load();
    // TODO: Update to handle nested objects/ get world position
    this.shape.position.copyFrom(
      this.owner.transform.position.toVector2().add(this.shape.offset)
    );
    CollisionManager.registerComponent(this);
    // Tell the collision manager that we exist.
  }

  update(time: number) {
    // TODO: Update to handle nested objects/ get world position
    this.shape.position.copyFrom(
      this.owner.transform.position.toVector2().add(this.shape.offset)
    );
    super.update(time);
  }

  onCollisionEntry(other: CollisionComponent) {
    console.log('onCollisionEntry', this, other);
  }
  onCollisionUpdate(other: CollisionComponent) {
    // console.log('onCollisionUpdate', this, other);
  }
  onCollisionExit(other: CollisionComponent) {
    console.log('onCollisionExit', this, other);
  }
}
