export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
}
