export abstract class Shader {
  private name: string;
  private program!: WebGLProgram;
  private attributes: Record<string, GLint> = {};
  private uniforms: Record<string, WebGLUniformLocation> = {};

  constructor(name: string) {
    this.name = name;
  }

  use() {
    gl.useProgram(this.program);
  }
  getAttributeLocation(name: string) {
    const attribute = this.attributes[name];
    if (attribute == undefined)
      throw new Error(
        `Unable to find attribute named ${name} in shader name ${this.name}`
      );

    return attribute;
  }
  getUnifomrLocation(name: string) {
    const uniform = this.uniforms[name];
    if (uniform == undefined)
      throw new Error(
        `Unable to find uniform named ${name} in shader name ${this.name}`
      );

    return uniform;
  }

  protected load(vertexSource: string, fragmentSource: string) {
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmetnShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

    this.program = this.createProgram(vertexShader, fragmetnShader);
    this.detectAttributes();
    this.detectUniform();
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

  private detectAttributes() {
    let attributeCout = gl.getProgramParameter(
      this.program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributeCout; i++) {
      let info = gl.getActiveAttrib(this.program, i);
      if (!info) {
        break;
      }
      this.attributes[info.name] = gl.getAttribLocation(
        this.program,
        info.name
      );
    }
  }
  private detectUniform() {
    let uniformCout = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCout; i++) {
      let info = gl.getActiveUniform(this.program, i);
      if (!info) {
        break;
      }
      // @ts-ignore
      this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
    }
  }
}
