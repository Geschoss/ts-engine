export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  toArray() {
    return [this.x, this.y];
  }

  toFloat32Array() {
    return new Float32Array(this.toArray());
  }
}
