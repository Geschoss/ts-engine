import './math/extensions';
import { isDefined } from '../lib/ramda';
import { AssetManager } from './assets/manager';
import { AudioManager } from './audio/manager';
import { BehaviorManager } from './behaviors/manager';
import { CollisionManager } from './collision/manager';
import { ComponentManager } from './components/manager';
import { GLUtilities } from './gl/gl';
import { BasicShader } from './gl/shaders/basicShader';
import { Color } from './graphics/color';
import { Material } from './graphics/material';
import { MaterialManager } from './graphics/materialManager';
import { InputManager } from './input/manager';
import { Matrix4x4 } from './math/matrix4x4';
import { MessageBus } from './message/bus';
import { ZoneManager } from './world/zoneManager';
import { BitmapFontManager } from './graphics/bitmapManager';
import { Vector2 } from './math/vector2';

export class Engine {
  private canvas!: HTMLCanvasElement;
  private basicShader!: BasicShader;
  private projection!: Matrix4x4;
  private previosTime = 0;
  gameWidth: number;
  gameHeight: number;
  aspect!: number;

  isFirstUpdate = true;
  constructor(width: number, height: number) {
    this.gameHeight = height;
    this.gameWidth = width;
  }

  start(elementId: string) {
    this.canvas = GLUtilities.initialize(elementId);
    if (isDefined(this.gameHeight) && isDefined(this.gameWidth)) {
      this.aspect = this.gameWidth / this.gameHeight;
    }

    InputManager.initialize(this.canvas);
    AssetManager.initialize();
    ZoneManager.initialize();
    ComponentManager.iinitialize();
    BehaviorManager.iinitialize();

    this.basicShader = new BasicShader();
    this.basicShader.use();

    // Load fonts
    BitmapFontManager.add('default', 'assets/fonts/text.txt');
    BitmapFontManager.load();

    // Load materials
    MaterialManager.register(
      new Material('grass', 'assets/textures/grass.png', Color.white())
    );
    MaterialManager.register(
      new Material('duck', 'assets/textures/duck.png', Color.white())
    );
    MaterialManager.register(
      new Material('bg', 'assets/textures/bg.png', Color.white())
    );
    MaterialManager.register(
      new Material('end', 'assets/textures/end.png', Color.white())
    );
    MaterialManager.register(
      new Material('middle', 'assets/textures/middle.png', Color.white())
    );
    MaterialManager.register(
      new Material('playbtn', 'assets/textures/playbtn.png', Color.white())
    );
    MaterialManager.register(
      new Material(
        'restartbtn',
        'assets/textures/restartbtn.png',
        Color.white()
      )
    );
    MaterialManager.register(
      new Material('score', 'assets/textures/score.png', Color.white())
    );
    MaterialManager.register(
      new Material('title', 'assets/textures/title.png', Color.white())
    );
    MaterialManager.register(
      new Material('tutorial', 'assets/textures/tutorial.png', Color.white())
    );
    AudioManager.loadSoundFile('flap', 'assets/sounds/flap.mp3');
    AudioManager.loadSoundFile('ting', 'assets/sounds/ting.mp3');
    AudioManager.loadSoundFile('dead', 'assets/sounds/dead.mp3');

    this.projection = Matrix4x4.orthographic(
      0,
      this.canvas.width,
      this.canvas.height,
      0,
      -100,
      100
    );

    gl.clearColor(146 / 255, 206 / 255, 247 / 255, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.resize();
    this.preloading();
  }

  loop() {
    if (this.isFirstUpdate) {
    }
    this.update();
    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update() {
    let delta = performance.now() - this.previosTime;
    MessageBus.update(delta);
    ZoneManager.update(delta);
    CollisionManager.update(delta);

    this.previosTime = performance.now();
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    ZoneManager.render(this.basicShader);

    let projection = this.basicShader.getUniformLocation('u_projection');
    gl.uniformMatrix4fv(
      projection,
      false,
      new Float32Array(this.projection.data)
    );
  }

  preloading() {
    MessageBus.update(0);
    if (!BitmapFontManager.updateReady()) {
      requestAnimationFrame(this.preloading.bind(this));
      return;
    }

    ZoneManager.changeZone(0);
    this.loop();
  }

  resize() {
    if (!this.canvas) return;

    if (!isDefined(this.gameHeight) && !isDefined(this.gameWidth)) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      gl.viewport(0, 0, window.innerWidth, window.innerHeight);
      this.projection = Matrix4x4.orthographic(
        0,
        window.innerWidth,
        window.innerHeight,
        0,
        -100.0,
        100.0
      );
    } else {
      let newWidth = window.innerWidth;
      let newHeight = window.innerHeight;
      let newWidthToHeight = newWidth / newHeight;
      let gameArea = document.getElementById('gameArea') as HTMLElement;

      if (newWidthToHeight > this.aspect) {
        newWidth = newHeight * this.aspect;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
      } else {
        newHeight = newWidth / this.aspect;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
      }

      gameArea.style.marginTop = -newHeight / 2 + 'px';
      gameArea.style.marginLeft = -newWidth / 2 + 'px';

      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      gl.viewport(0, 0, newWidth, newHeight);
      this.projection = Matrix4x4.orthographic(
        0,
        this.gameWidth,
        this.gameHeight,
        0,
        -100,
        100
      );
      let resolutionScale = new Vector2(
        newWidth / this.gameWidth,
        newHeight / this.gameHeight
      );

      InputManager.setResolutionScale(resolutionScale);
    }
  }

  onMessage(message: IMessage) {
    if (message.code === 'MOUSE_DOWN') {
      AudioManager.playSound('flap');
    }
  }
}

// setTimeout(() => {
//   MessageBus.send('GAME_START');
// }, 1000);
