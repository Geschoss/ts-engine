import './style.css';
import { Engine } from './core/engine';

let engine: Engine;
window.onload = () => {
  engine = new Engine(320, 420);
  engine.start('canvas');
};

window.onresize = () => {
  engine.resize();
};
