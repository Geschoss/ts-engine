import { Vector2 } from '../../math/vector2';

export interface IShape2D {
  offset: Vector2;
  origin: Vector2;
  position: Vector2;
  intersects(other: IShape2D): boolean;
  pointInShape(point: Vector2): boolean;
  setFromJson(json: any): void;
}
