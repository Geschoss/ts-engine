import { AssetManager } from './assets/manager';
import { ComponentManager } from './components/manager';
import { SpriteComponentBuilder } from './components/sprite';
import { GLUtilities } from './gl/gl';
import { BasicShader } from './gl/shaders/basicShader';
import { Color } from './graphics/color';
import { Material } from './graphics/material';
import { MaterialManager } from './graphics/materialManager';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageBus } from './message/bus';
import { ZoneManager } from './world/zoneManager';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private basicShader!: BasicShader;
  private projection!: Matrix4x4;

  constructor() {}

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    ZoneManager.initialize();
    AssetManager.initialize();
    ComponentManager.registerBuilder(new SpriteComponentBuilder())

    this.basicShader = new BasicShader();
    this.basicShader.use();

    // Load materials
    MaterialManager.register(
      new Material(
        'crate',
        'assets/textures/crate.jpeg',
        Color.white()
      )
    );
    MaterialManager.register(
      new Material(
        'wood',
        'assets/textures/wood.jpeg',
        Color.white()
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

    // TODO: Change this to be read from a game confg
    ZoneManager.changeZone(0);
    
    gl.clearColor(0, 0, 0, 1);
    this.resize();
    this.loop();
  }

  loop() {
    MessageBus.update(0);
    ZoneManager.update(0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    ZoneManager.render(this.basicShader);

    let projection = this.basicShader.getUnifomrLocation('u_projection');
    gl.uniformMatrix4fv(
      projection,
      false,
      new Float32Array(this.projection.data)
    );

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
