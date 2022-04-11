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

  copyFrom(vector: Vector3) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
  }

  static zero() {
    return new Vector3();
  }

  static one() {
    return new Vector3(1, 1, 1);
  }
}
