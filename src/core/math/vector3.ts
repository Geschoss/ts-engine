import { isDefined } from '../../lib/ramda';
import { Vector2 } from './vector2';

export class Vector3 {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static distance(a: Vector3, b: Vector3): number {
    let diff = a.clone().subtract(b);
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
  }

  toVector2() {
    return new Vector2(this.x, this.y);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  equals(v: Vector3) {
    return this.x === v.x && this.y === v.y && this.z === v.z;
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

  set(x?: number, y?: number, z?: number) {
    if (isDefined(x)) {
      this.x = x;
    }
    if (isDefined(y)) {
      this.y = y;
    }
    if (isDefined(z)) {
      this.z = z;
    }
  }
  setFromJson(json: any) {
    if (json.x !== undefined) {
      this.x = Number(json.x);
    }
    if (json.y !== undefined) {
      this.y = Number(json.y);
    }
    if (json.z !== undefined) {
      this.z = Number(json.z);
    }
  }

  add(v: Vector3): Vector3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  subtract(v: Vector3): Vector3 {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  multiply(v: Vector3): Vector3 {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
    return this;
  }
  divide(v: Vector3): Vector3 {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
    return this;
  }
}
