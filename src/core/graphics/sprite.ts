import { GLBuffer } from '../gl/glBuffer';
import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { Material } from './material';
import { MaterialManager } from './materialManager';

export class Sprite {
  name: string;
  materialName: string;
  private buffer!: GLBuffer;
  material: Material;

  constructor(
    name: string,
    materialName: string,
    private width: number = 100,
    private height: number = 100
  ) {
    this.name = name;
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
    this.buffer = new GLBuffer(5);
    // prettier-ignore
    let vertices = [
      // x, y, z   ,u,v
      0, 0, 0, 0, 0,
      0, this.height, 0, 0, 1.0,
      this.width, this.height, 0, 1.0, 1.0,

      this.width, this.height, 0.0, 1.0, 1.0,
      this.width, 0.0, 0.0, 1.0, 0,
      0.0, 0.0, 0.0, 0, 0
    ];

    let positionAttribute = {
      location: 0,
      offset: 0,
      size: 3,
    };
    this.buffer.addAtributeLocation(positionAttribute);

    let textCoordAttribute = {
      location: 1,
      offset: 3,
      size: 2,
    };
    this.buffer.addAtributeLocation(textCoordAttribute);

    this.buffer.pushBackData(vertices);
    this.buffer.upload();
    this.buffer.unbind();
  }
  update(time: number) {}

  draw(shader: Shader, model: Matrix4x4) {
    
    let v = Matrix4x4.translation(new Vector3()).data;
  

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
