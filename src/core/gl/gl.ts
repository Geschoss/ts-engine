export class GLUtilities {
    public static initialize(elementId: string): HTMLCanvasElement {
        const canvas = document.getElementById(elementId) as HTMLCanvasElement;
        if (!canvas) throw new Error('Cant find canvas');

        const gl = canvas.getContext('webgl');
        if (!gl) throw new Error('Enable to initialize WebGL');
        window.gl = gl;
        return canvas;
    }
}
