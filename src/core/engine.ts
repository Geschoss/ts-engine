import { GLUtilities } from './gl/gl';
import { GLBuffer } from './gl/glBuffer';
import { Shader } from './gl/shader';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private shader!: Shader;
  private buffer!: GLBuffer;

  constructor() {}
  start(elementId: string) {
    const canvas = GLUtilities.initialize(elementId);
    this.canvas = canvas;

    this.shader = this.loadShaders();
    this.shader.use();

    this.createBuffer();
    this.resize();

    gl.clearColor(0, 0, 0, 1);
    this.loop();
  }

  loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let color = this.shader.getUnifomrLocation('u_color');
    gl.uniform4f(color, 1, 0.5, 0, 1)

    this.buffer.bind();
    this.buffer.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  private loadShaders() {
    const vertexShaderSource = `
attribute vec3 a_position;
void main() {
    gl_Position = vec4(a_position, 1.0);
}`;
    const fragmetnShaderSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}`;

    return new Shader('basic', vertexShaderSource, fragmetnShaderSource);
  }

  private createBuffer() {
    let vertices = [0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0];
    let positionAttribute = {
      location: this.shader.getAttributeLocation('a_position'),
      offset: 0,
      size: 3,
    };

    this.buffer = new GLBuffer(3);
    this.buffer.pushBackData(vertices);
    this.buffer.upload();
    this.buffer.addAtributeLocation(positionAttribute);
    this.buffer.unbind();
  }
}
