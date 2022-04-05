import { GLBuffer } from '../gl/glBuffer';
import { Vector3 } from '../math/vector3';

export class Sprite {
  private buffer!: GLBuffer;
  position = new Vector3();

  constructor(
    private name: string,
    private width: number = 100,
    private height: number = 100
  ) {}

  load() {
    // prettier-ignore
    let vertices = [
      0, 0, 0,
      0, this.height, 0,
      this.width, this.height, 0,

      this.width, this.height, 0.0,
      this.width, 0.0, 0.0,
      0.0, 0.0, 0.0,
    ];

    let positionAttribute = {
      location: 0,
      offset: 0,
      size: 3,
    };

    this.buffer = new GLBuffer(3);
    this.buffer.pushBackData(vertices);
    this.buffer.upload();
    this.buffer.addAtributeLocation(positionAttribute);
    this.buffer.unbind();
  }
  update(time: number) {}

  draw() {
    this.buffer.bind();
    this.buffer.draw();
  }
}
