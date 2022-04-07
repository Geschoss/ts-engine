import { AssetManager } from './assets/assetManaget';
import { GLUtilities } from './gl/gl';
import { Shader } from './gl/shader';
import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageBus } from './message/messageBus';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private shader!: Shader;
  private sprite!: Sprite;
  private projection!: Matrix4x4;

  constructor() {}

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    AssetManager.initialize();

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
    this.sprite = new Sprite('test', 'assets/textures/crate.jpeg', 100, 100);
    this.sprite.load();
    this.sprite.position.x = 100;
    this.sprite.position.y = 100;

    this.loop();
  }

  loop() {
    MessageBus.update(0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let color = this.shader.getUnifomrLocation('u_tint');
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

    this.sprite.draw(this.shader);

    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    gl.viewport(-1, 1, this.canvas.width, this.canvas.height);
  }

  private loadShaders() {
    const vertexShaderSource = `
attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_projection;

varying vec2 v_texCoord;

void main() {
  gl_Position = u_projection * u_model * vec4(a_position, 1.0);
  v_texCoord = a_texCoord;
}`;
    const fragmetnShaderSource = `
precision mediump float;
uniform vec4 u_tint;
uniform sampler2D u_diffuse;

varying vec2 v_texCoord;

void main() {
  gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
}`;

    return new Shader('basic', vertexShaderSource, fragmetnShaderSource);
  }
}
