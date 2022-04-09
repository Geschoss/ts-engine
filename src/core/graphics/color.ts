export class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(
    r: number = 255,
    g: number = 255,
    b: number = 255,
    a: number = 255
  ) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toArray() {
    return [this.r, this.g, this.b, this.a];
  }

  toFloatArray() {
    return [this.r / 255.0, this.g / 255.0, this.b / 255.0, this.a / 255.0];
  }
  toFloat32Array() {
    return new Float32Array(this.toFloatArray());
  }
  static white() {
    return new Color(255, 255, 255, 255);
  }
  static black() {
    return new Color(0, 0, 0, 255);
  }
  static red() {
    return new Color(255, 0, 0, 255);
  }
  static green() {
    return new Color(0, 255, 0, 255);
  }
  static bluegreen() {
    return new Color(0, 0, 255, 255);
  }
}
