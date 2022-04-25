import { isDefined } from '../../../lib/ramda';
import { Vector2 } from '../../math/vector2';
import { Circle2D } from './cirlce2D';
import { IShape2D } from './global';

export class Rectangle2D implements IShape2D {
  position: Vector2 = Vector2.zero();
  offset: Vector2 = Vector2.zero();
  width!: number;
  height!: number;

  intersects(other: IShape2D) {
    if (other instanceof Rectangle2D) {
      if (
        this.pointInShape(other.position) ||
        this.pointInShape(
          new Vector2(other.position.x + other.width, other.position.y)
        ) ||
        this.pointInShape(
          new Vector2(
            other.position.x + other.width,
            other.position.y + other.height
          )
        ) ||
        this.pointInShape(
          new Vector2(other.position.x, other.position.y + other.height)
        )
      ) {
        return true;
      }
    }

    if (other instanceof Circle2D) {
      if (
        other.pointInShape(this.position) ||
        other.pointInShape(
          new Vector2(this.position.x + this.width, this.position.y)
        ) ||
        other.pointInShape(
          new Vector2(
            this.position.x + this.width,
            this.position.y + this.height
          )
        ) ||
        other.pointInShape(
          new Vector2(this.position.x, this.position.y + this.height)
        )
      ) {
        return true;
      }
    }

    return false;
  }

  pointInShape(point: Vector2) {
    if (point.x >= this.position.x && point.x <= this.position.x + this.width) {
      if (
        point.y >= this.position.y &&
        point.y <= this.position.y + this.height
      ) {
        return true;
      }
    }
    return false;
  }

  setFromJson(json: any): void {
    let position = json.position;
    if (isDefined(position)) {
      this.position.setFromJson(position);
    }
    let width = json.width;
    if (!isDefined(width)) {
      throw new Error('Rectangle2D requires width to be present.');
    }
    this.width = Number(width);

    let height = json.height;
    if (!isDefined(height)) {
      throw new Error('Rectangle2D requires height to be present.');
    }
    this.height = Number(height);

    let offset = json.offset;
    if (!isDefined(offset)) {
      throw new Error('Rectangle2D requires offset to be present.');
    }
    this.offset.setFromJson( json.offset );
  }
}
