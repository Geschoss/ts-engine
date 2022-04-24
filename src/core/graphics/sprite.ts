import { GLBuffer } from '../gl/glBuffer';
import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { Material } from './material';
import { MaterialManager } from './materialManager';
import { Vertex } from './vertex';

export class Sprite {
  readonly origin = Vector3.zero();

  name: string;
  materialName: string;
  material: Material;
  width: number = 100;
  height: number = 100;

  buffer!: GLBuffer;
  vertices!: Vertex[];

  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100
  ) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.materialName = materialName;
    this.material = MaterialManager.get(this.materialName);
  }

  setOrigin(value: Vector3) {
    // @ts-ignore
    this.origin = value;
    this.recalculateVertices();
  }

  destroy() {
    this.buffer.destroy();
    MaterialManager.release(this.materialName);
    // @ts-ignore
    this.material = undefined;
  }

  load() {
    this.buffer = new GLBuffer();

    this.buffer.addAtributeLocation({
      location: 0,
      size: 3,
    });

    this.buffer.addAtributeLocation({
      location: 1,
      size: 2,
    });

    this.calculateVertices();
  }
  update(_: number) {}

  draw(shader: Shader, model: Matrix4x4) {
    let modelLocation = shader.getUnifomrLocation('u_model');
    gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

    let color = shader.getUnifomrLocation('u_tint');
    gl.uniform4fv(color, this.material.tint.toFloat32Array());

    if (this.material.diffuseTexture !== undefined) {
      this.material.diffuseTexture.activateAndBind(0);
      let diffuseLocation = shader.getUnifomrLocation('u_diffuse');
      gl.uniform1i(diffuseLocation, 0);
    }

    this.buffer.bind();
    this.buffer.draw();
  }

  protected calculateVertices() {
    let minX = -(this.width * this.origin.x);
    let maxX = this.width * (1.0 - this.origin.x);

    let minY = -(this.height * this.origin.y);
    let maxY = this.height * (1.0 - this.origin.y);

    // prettier-ignore
    this.vertices = [
      // x, y, z,      u, v
      new Vertex(minX, minY, 0, 0, 0),
      new Vertex(minX, maxY, 0, 0, 1.0),
      new Vertex(maxX, maxY, 0, 1.0, 1.0),

      new Vertex(maxX, maxY, 0.0, 1.0, 1.0),
      new Vertex(maxX, minY, 0.0, 1.0, 0),
      new Vertex(minX, minY, 0.0, 0, 0)
    ];

    for (let v of this.vertices) {
      this.buffer.pushBackData(v.toArray());
    }
    this.buffer.upload();
    this.buffer.unbind();
  }

  protected recalculateVertices() {
    let minX = -(this.width * this.origin.x);
    let maxX = this.width * (1.0 - this.origin.x);

    let minY = -(this.height * this.origin.y);
    let maxY = this.height * (1.0 - this.origin.y);

    this.vertices[0].position.set(minX, minY);
    this.vertices[1].position.set(minX, maxY);
    this.vertices[2].position.set(maxX, maxY);

    this.vertices[3].position.set(maxX, maxY),
      this.vertices[4].position.set(maxX, minY),
      this.vertices[5].position.set(minX, minY);

    this.buffer.clearData();
  }
}
