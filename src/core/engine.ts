import { GLUtilities } from './gl/gl';
import { Shader } from './gl/shader';

export class Engine {
  private canvas: HTMLCanvasElement;
  private shader: Shader;

  constructor(elementId: string) {
    const canvas = GLUtilities.initialize(elementId);

    this.canvas = canvas;
  }
  start() {
    gl.clearColor(0, 0, 0, 1);
    this.resize();

    this.shader = this.loadShaders();
    this.shader.use();
    this.loop();
  }

  loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private loadShaders() {
    const vertexShaderSource = `
attribute vec3 a_position;
void main() {
    gl_Position = vec4(a_position, 1.0);
}`;
    const fragmetnShaderSource = `
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0);
}`;

    return new Shader('basic', vertexShaderSource, fragmetnShaderSource);
  }
}
