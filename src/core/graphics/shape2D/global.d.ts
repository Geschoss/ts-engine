import { Vector2 } from '../../math/vector2';

export interface IShape2D {
  position: Vector2;
  intersects(other: IShape2D): boolean;
  pointInShape(point: Vector2): boolean;
  setFromJson(json: any): void;
}
