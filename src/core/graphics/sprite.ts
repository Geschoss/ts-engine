import { GLBuffer } from '../gl/glBuffer';
import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Material } from './material';
import { MaterialManager } from './materialManager';
import { Vertex } from './vertex';

export class Sprite {
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

    // prettier-ignore
    this.vertices = [
      // x, y, z,      u, v
      new Vertex(0, 0, 0, 0, 0),
      new Vertex(0, this.height, 0, 0, 1.0),
      new Vertex(this.width, this.height, 0, 1.0, 1.0),

      new Vertex(this.width, this.height, 0.0, 1.0, 1.0),
      new Vertex(this.width, 0.0, 0.0, 1.0, 0),
      new Vertex(0.0, 0.0, 0.0, 0, 0)
    ];

    for (let v of this.vertices) {
      this.buffer.pushBackData(v.toArray());
    }
    this.buffer.upload();
    this.buffer.unbind();
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
}
