import { Matrix4x4 } from './matrix4x4';
import { Vector3 } from './vector3';

export class Transform {
  position: Vector3 = Vector3.one();
  rotation: Vector3 = Vector3.zero();
  scale: Vector3 = Vector3.one();

  copyFrom(transform: Transform) {
    this.position.copyFrom(transform.position);
    this.rotation.copyFrom(transform.rotation);
    this.scale.copyFrom(transform.scale);
  }

  getTransformationMatrix() {
    let translation = Matrix4x4.translation(this.position);
    // TODO: Add x and y for 3D
    let rotation = Matrix4x4.rotationZ(this.rotation.z);
    let scale = Matrix4x4.scale(this.scale);

    // T * R * S
    return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
  }
}
