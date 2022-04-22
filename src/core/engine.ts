import { AssetManager } from './assets/manager';
import { AudioManager } from './audio/manager';
import { BehaviorManager } from './behaviors/manager';
import { ComponentManager } from './components/manager';
import { GLUtilities } from './gl/gl';
import { BasicShader } from './gl/shaders/basicShader';
import { Color } from './graphics/color';
import { Material } from './graphics/material';
import { MaterialManager } from './graphics/materialManager';
import { InputManager, MouseEvents } from './input/manager';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageBus } from './message/bus';
import { ZoneManager } from './world/zoneManager';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private basicShader!: BasicShader;
  private projection!: Matrix4x4;
  private previosTime = 0;

  constructor() {}

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    InputManager.initialize();
    AssetManager.initialize();
    ZoneManager.initialize();
    ComponentManager.iinitialize();
    BehaviorManager.iinitialize();

    MessageBus.subscribe<MouseEvents>(
      'MOUSE_UP_EVENT',
      this.onMessage.bind(this)
    );
    MessageBus.subscribe<MouseEvents>(
      'MOUSE_DOWN_EVENT',
      this.onMessage.bind(this)
    );

    AudioManager.loadSoundFile('flap', 'assets/sounds/flap.mp3');

    this.basicShader = new BasicShader();
    this.basicShader.use();

    // Load materials
    MaterialManager.register(
      new Material('crate', 'assets/textures/crate.jpeg', Color.white())
    );
    MaterialManager.register(
      new Material('wood', 'assets/textures/wood.jpeg', Color.white())
    );

    MaterialManager.register(
      new Material('duck', 'assets/textures/duck.png', Color.white())
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

    gl.clearColor(0, 0, 0.3, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.resize();
    this.loop();
  }

  loop() {
    this.update();
    this.render();
  }

  update() {
    let delta = performance.now() - this.previosTime;
    MessageBus.update(delta);
    ZoneManager.update(delta);

    this.previosTime = performance.now();
  }

  render() {
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

  onMessage(message: IMessage<MouseEvents>) {
    if (message.code === 'MOUSE_DOWN_EVENT') {
      AudioManager.playSound('flap');
    }
  }
}
