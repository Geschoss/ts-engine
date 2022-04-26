import { isDefined } from '../../../lib/ramda';
import { Vector2 } from '../../math/vector2';
import { IShape2D } from './global';
import { Rectangle2D } from './rectangle2D';

export class Circle2D implements IShape2D {
  position: Vector2 = Vector2.zero();
  origin: Vector2 = Vector2.zero();
  radius!: number;

  get offset() {
    return new Vector2(
      this.radius + this.radius * this.origin.x,
      this.radius + this.radius * this.origin.y
    );
  }

  intersects(other: IShape2D): boolean {
    if (other instanceof Circle2D) {
      let distance = Math.abs(Vector2.distance(other.position, this.position));
      let radiusLengths = this.radius + other.radius;
      if (distance <= radiusLengths) {
        return true;
      }
    }

    if (other instanceof Rectangle2D) {
      let deltaX =
        this.position.x -
        Math.max(
          other.position.x,
          Math.min(this.position.x, other.position.x + other.width)
        );
      let deltaY =
        this.position.y -
        Math.max(
          other.position.y,
          Math.min(this.position.y, other.position.y + other.height)
        );

      if (deltaX * deltaX + deltaY * deltaY < this.radius * this.radius) {
        return true;
      }
    }

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
    this.radius = radius;

    if (isDefined(json.origin)) {
      this.origin.setFromJson(json.origin);
    }
  }
}
