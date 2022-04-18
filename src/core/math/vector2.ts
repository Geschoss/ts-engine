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
  
  static one() {
    return new Vector2(1, 1);
  }

  setFromJson(json: any) {
    if (json.x !== undefined) {
      this.x = Number(json.x);
    }
    if (json.y !== undefined) {
      this.y = Number(json.y);
    }
  }
}
