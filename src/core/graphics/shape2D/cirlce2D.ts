import { isDefined } from '../../../lib/ramda';
import { Vector2 } from '../../math/vector2';
import { IShape2D } from './global';
import { Rectangle2D } from './rectangle2D';

export class Circle2D implements IShape2D {
  position: Vector2 = Vector2.zero();
  radius!: number;

  intersects(other: IShape2D): boolean {
    if (other instanceof Circle2D) {
      let distance = Math.abs(Vector2.distance(this.position, other.position));
      let radiusLengths = this.radius + other.radius;
      if (distance <= radiusLengths) {
        return true;
      }
    }
    // if (other instanceof Rectangle2D) {

    // }
    return false;
  }
  pointInShape(point: Vector2): boolean {
    let absDistance = Math.abs(Vector2.distance(this.position, point));
    if (absDistance <= this.radius) {
      return true;
    }
    return false;
  }

  setFromJson(json: any): void {
    let position = json.position;
    if (isDefined(position)) {
      this.position.setFromJson(position);
    }
    let radius = json.radius;
    if (!isDefined(radius)) {
      throw new Error('Rectangle2D requires radius to be present.');
    }
    this.radius = Number(radius);
  }
}
