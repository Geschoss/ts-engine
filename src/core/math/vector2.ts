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

  static distance(a: Vector2, b: Vector2): number {
    let diff = a.clone().subtract( b );
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  }
  static one() {
    return new Vector2(1, 1);
  }
  static zero() {
    return new Vector2();
  }

  clone() {
    return new Vector2(this.x, this.y);
  }
  setFromJson(json: any) {
    if (json.x !== undefined) {
      this.x = Number(json.x);
    }
    if (json.y !== undefined) {
      this.y = Number(json.y);
    }
  }

  copyFrom(v: Vector2) {
    this.x = v.x;
    this.y = v.y;
  }

  add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  subtract(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  multiply(v: Vector2): Vector2 {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  divide(v: Vector2): Vector2 {
    this.x /= v.x;
    this.y /= v.y;
    return this;
  }
}
