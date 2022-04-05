import { Vector3 } from './vector3';

export class Matrix4x4 {
  data: number[] = [];

  private constructor() {
    // prettier-ignore
    this.data = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  public static identity() {
    return new Matrix4x4();
  }

  public static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number
  ) {
    let m = new Matrix4x4();

    let lr = 1.0 / (left - right);
    let bt = 1.0 / (bottom - top);
    let nf = 1.0 / (nearClip - farClip);

    m.data[0] = -2.0 * lr;
    m.data[5] = -2.0 * bt;
    m.data[10] = 2.0 * nf;

    m.data[12] = (left + right) * lr;
    m.data[13] = (top + bottom) * bt;
    m.data[14] = (farClip + nearClip) * nf;

    return m;
  }

  static translation(position: Vector3) {
    let m = new Matrix4x4();

    m.data[12] = position.x;
    m.data[13] = position.y;
    m.data[14] = position.z;
    return m;
  }
}
