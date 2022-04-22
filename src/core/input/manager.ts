import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';

export type MouseEvents = 'MOUSE_UP_EVENT' | 'MOUSE_DOWN_EVENT';
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

export class InputManager {
  static Keys = Keys;
  static initialize() {
    for (let i = 0; i < 255; i++) {
      _keys[i] = false;
    }
    window.addEventListener('keyup', InputManager.onKeyUp);
    window.addEventListener('keydown', InputManager.onKeyDown);
    window.addEventListener('mousemove', InputManager.onMouseMove);
    window.addEventListener('mousedown', InputManager.onMouseDown);
    window.addEventListener('mouseup', InputManager.onMouseUp);
  }
  static isKeyDown(key: Keys) {
    return _keys[key];
  }
  static onKeyDown(event: KeyboardEvent) {
    _keys[event.keyCode] = true;
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  static onKeyUp(event: KeyboardEvent) {
    _keys[event.keyCode] = false;
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  static getMousePosition(): Vector2 {
    return new Vector2(mouseX, mouseY);
  }
  static onMouseMove(event: MouseEvent) {
    prevMouseX = mouseX;
    prevMouseY = mouseY;

    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  static onMouseDown(event: MouseEvent) {
    if (event.button === 0) {
      leftDown = true;
    } else if (event.button === 2) {
      rightDown = true;
    }
    MessageBus.send<MouseEvents>('MOUSE_DOWN_EVENT', {
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

    MessageBus.send<MouseEvents>('MOUSE_UP_EVENT', {
      leftDown,
      rightDown,
      position: InputManager.getMousePosition(),
    });
  }
}
