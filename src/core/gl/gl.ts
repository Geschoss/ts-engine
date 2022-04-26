import { isDefined } from '../../lib/ramda';

export class GLUtilities {
  public static initialize(elementId: string): HTMLCanvasElement {
    const canvas = document.getElementById(elementId) as HTMLCanvasElement;
    if (!canvas) throw new Error('Cant find canvas');

    let gl = canvas.getContext('webgl');
    if (!isDefined(gl)) {
      throw new Error('Enable to initialize WebGL');
    }
    window.gl = gl;
    return canvas;
  }
}
