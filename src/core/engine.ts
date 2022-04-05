import { GLUtilities } from './gl/gl';
import { Shader } from './gl/shader';
import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private shader!: Shader;
  private sprite!: Sprite;
  private projection!: Matrix4x4;

  constructor() {}

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    this.resize();

    this.shader = this.loadShaders();
    this.shader.use();

    gl.clearColor(0, 0, 0, 1);

    this.projection = Matrix4x4.orthographic(
      0,
      this.canvas.width,
      0,
      this.canvas.height,
      -100,
      100
    );
    this.sprite = new Sprite('test', 200, 200);
    this.sprite.load();
    this.sprite.position.x = 100;
    this.sprite.position.y = 100;

    this.loop();
  }

  loop() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    let color = this.shader.getUnifomrLocation('u_color');
    gl.uniform4f(color, 1, 0.5, 0, 1);

    let projection = this.shader.getUnifomrLocation('u_projection');
    gl.uniformMatrix4fv(
      projection,
      false,
      new Float32Array(this.projection.data)
    );

    let model = this.shader.getUnifomrLocation('u_model');
    gl.uniformMatrix4fv(
      model,
      false,
      new Float32Array(Matrix4x4.translation(this.sprite.position).data)
    );

    this.sprite.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    gl.viewport(-1, 1, -1, 1);
  }

  private loadShaders() {
    const vertexShaderSource = `
attribute vec3 a_position;

uniform mat4 u_model;
uniform mat4 u_projection;

void main() {
    gl_Position = u_projection * u_model * vec4(a_position, 1.0);
}`;
    const fragmetnShaderSource = `
precision mediump float;
uniform vec4 u_color;
void main() {
    gl_FragColor = u_color;
}`;

    return new Shader('basic', vertexShaderSource, fragmetnShaderSource);
  }
}
