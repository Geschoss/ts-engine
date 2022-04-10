import { ImageLoader } from './assets/imageLoader';
import { AssetManager } from './assets/manager';
import { GLUtilities } from './gl/gl';
import { BasicShader } from './gl/shaders/basicShader';
import { Color } from './graphics/color';
import { Material } from './graphics/material';
import { MaterialManager } from './graphics/materialManager';
import { Sprite } from './graphics/sprite';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageBus } from './message/bus';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private basicShader!: BasicShader;
  private sprite!: Sprite;
  private projection!: Matrix4x4;

  constructor() {}

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    AssetManager.register(new ImageLoader());
    gl.clearColor(0, 0, 0, 1);

    this.basicShader = new BasicShader();
    this.basicShader.use();

    // Load materials
    MaterialManager.register(
      new Material(
        'crate',
        'assets/textures/crate.jpeg',
        new Color(0, 128, 0, 255)
      )
    );

    this.projection = Matrix4x4.orthographic(
      0,
      this.canvas.width,
      this.canvas.height,
      0,
      -100,
      100
    );

    this.sprite = new Sprite('test', 'crate', 100, 100);
    this.sprite.load();
    this.sprite.position.x = 100;
    this.sprite.position.y = 100;

    this.resize();
    this.loop();
  }

  loop() {
    MessageBus.update(0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let projection = this.basicShader.getUnifomrLocation('u_projection');
    gl.uniformMatrix4fv(
      projection,
      false,
      new Float32Array(this.projection.data)
    );

    this.sprite.draw(this.basicShader);

    requestAnimationFrame(this.loop.bind(this));
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.projection = Matrix4x4.orthographic(
      0,
      this.canvas.width,
      this.canvas.height,
      0,
      -100,
      100
    );

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
}
