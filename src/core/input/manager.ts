import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';

export type MouseEvents = 'MOUSE_UP' | 'MOUSE_DOWN';
export enum Keys {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
}
let _keys: boolean[] = [];
let prevMouseX = 0;
let prevMouseY = 0;
let mouseX = 0;
let mouseY = 0;
let leftDown = false;
let rightDown = false;
let resolutionScale = Vector2.one();

export class InputManager {
  static Keys = Keys;
  static initialize(viewport: HTMLCanvasElement) {
    for (let i = 0; i < 255; i++) {
      _keys[i] = false;
    }
    window.addEventListener('keyup', InputManager.onKeyUp);
    window.addEventListener('keydown', InputManager.onKeyDown);

    viewport.addEventListener('mousemove', InputManager.onMouseMove);
    viewport.addEventListener('mousedown', InputManager.onMouseDown);
    viewport.addEventListener('mouseup', InputManager.onMouseUp);
  }
  static setResolutionScale(scale: Vector2) {
    resolutionScale.copyFrom(scale);
  }
  static isKeyDown(key: Keys) {
    return _keys[key];
  }
  static onKeyDown(event: KeyboardEvent) {
    _keys[event.keyCode] = true;
    return true;
  }
  static onKeyUp(event: KeyboardEvent) {
    _keys[event.keyCode] = false;
    return true;
  }
  static getMousePosition(): Vector2 {
    return new Vector2(mouseX, mouseY);
  }
  static onMouseMove(event: MouseEvent) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;

    let rect = (event.target as HTMLElement).getBoundingClientRect();
    mouseX = (event.clientX - Math.round(rect.left)) * (1 / resolutionScale.x);
    mouseY = (event.clientY - Math.round(rect.top)) * (1 / resolutionScale.y);
  }
  static onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      leftDown = true;
    } else if (event.button === 2) {
      rightDown = true;
    }
    MessageBus.send('MOUSE_DOWN', {
      leftDown,
      rightDown,
      position: InputManager.getMousePosition(),
    });
  }
  static onMouseUp(event: MouseEvent) {
    if (event.button === 0) {
      leftDown = false;
    } else if (event.button === 2) {
      rightDown = false;
    }

    MessageBus.send('MOUSE_UP', {
      leftDown,
      rightDown,
      position: InputManager.getMousePosition(),
    });
  }
}
