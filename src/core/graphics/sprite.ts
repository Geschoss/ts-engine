import { GLBuffer } from '../gl/glBuffer';
import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { Texture } from './texture';
import { TextureManager } from './textureManager';

export class Sprite {
  name: string;
  textureName: string;
  private buffer!: GLBuffer;
  position = new Vector3();
  texture: Texture;

  constructor(
    name: string,
    textureName: string,
    private width: number = 100,
    private height: number = 100
  ) {
    this.name = name;
    this.textureName = textureName;
    this.texture = TextureManager.getTexture(textureName);
  }

  destroy() {
    this.buffer.destroy();
    TextureManager.releaseTexture(this.textureName);
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

  draw(shader: Shader) {
    let model = shader.getUnifomrLocation('u_model');
    gl.uniformMatrix4fv(
      model,
      false,
      new Float32Array(Matrix4x4.translation(this.position).data)
    );

    let color = shader.getUnifomrLocation('u_tint');
    gl.uniform4f(color, 1, 1, 1, 1);

    this.texture.activateAndBind(0);
    let diffuseLocation = shader.getUnifomrLocation('u_diffuse');
    gl.uniform1i(diffuseLocation, 0);
    this.buffer.bind();
    this.buffer.draw();
  }
}
