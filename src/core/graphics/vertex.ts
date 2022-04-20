import { Vector2 } from '../math/vector2';
import { Vector3 } from '../math/vector3';

export class Vertex {
  position: Vector3 = Vector3.zero();
  textCoords: Vector2 = Vector2.zero();

  constructor(x: number, y: number, z: number, tu: number = 0, tv: number = 0) {
    this.position = new Vector3(x, y, z);
    this.textCoords = new Vector2(tu, tv);
  }

  toArray() {
    return ([] as number[])
      .concat(this.position.toArray())
      .concat(this.textCoords.toArray());
  }

  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
}
