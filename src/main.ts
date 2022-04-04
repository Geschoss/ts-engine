import './style.css';
import { Engine } from './core/engine';

let engine: Engine;
window.onload = () => {
  engine = new Engine();
  engine.start('canvas');
};

window.onresize = () => {
  engine.resize();
};
