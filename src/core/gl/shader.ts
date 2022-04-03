export class Shader {
  private readonly name: string;
  private readonly program: WebGLProgram;

  constructor(name: string, vertexSource: string, fragmentSource: string) {
    this.name = name;
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmetnShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

    this.program = this.createProgram(vertexShader, fragmetnShader);
  }

  use() {
    gl.useProgram(this.program);
  }

  private loadShader(source: string, shaderType: number) {
    let shader = gl.createShader(shaderType);
    if (!shader)
      throw new Error(`Cant create shader ${this.name}, type: ${shaderType}`);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let error = gl.getShaderInfoLog(shader);
    if (error)
      throw new Error(`Error compiling shader ${this.name}, error: ${error}`);
    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ) {
    const program = gl.createProgram();
    if (!program) throw new Error(`Cant create program on shader ${this.name}`);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const error = gl.getProgramInfoLog(program);
    if (error)
      throw new Error(`Error linking shader ${this.name}, error: ${error}`);
    return program;
  }
}
