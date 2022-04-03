import './style.css';
import { Engine } from './core/engine';

let engine: Engine;
window.onload = () => {
    engine = new Engine('canvas');
    engine.start();
};

window.onresize = () => {
    engine.resize();
};
