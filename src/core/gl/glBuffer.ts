type AttributeInfo = {
  location: number;
  size: number;
  offset: number;
};

export class GLBuffer {
  private hasAttributeLocation = false;
  private elementSize: number;
  private stribe: number;
  private buffer: WebGLBuffer;

  private targetBufferType: number;
  private dataType: number;
  private mode: number;
  private typeSize: number;

  private data: number[] = [];
  private attributes: AttributeInfo[] = [];

  constructor(
    elementSize: number,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES
  ) {
    this.elementSize = elementSize;
    this.dataType = dataType;
    this.targetBufferType = targetBufferType;
    this.mode = mode;
    this.typeSize = typeByDataType(this.dataType);
    this.stribe = this.elementSize * this.typeSize;
    // @ts-ignore
    this.buffer = gl.createBuffer();
  }

  destroy() {
    gl.deleteBuffer(this.buffer);
  }

  bind(normalize: boolean = false) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    if (this.hasAttributeLocation) {
      for (let attr of this.attributes) {
        gl.vertexAttribPointer(
          attr.location,
          attr.size,
          this.dataType,
          normalize,
          this.stribe,
          attr.offset * this.typeSize
        );
        gl.enableVertexAttribArray(attr.location);
      }
    }
  }

  unbind() {
    for (let attr of this.attributes) {
      gl.disableVertexAttribArray(attr.location);
    }

    gl.bindBuffer(this.targetBufferType, null);
  }

  addAtributeLocation(info: AttributeInfo) {
    this.hasAttributeLocation = true;
    this.attributes.push(info);
  }

  pushBackData(data: number[]) {
    this.data.push(...data);
  }

  upload() {
    this.data.concat(this.data);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    let bufferData = wrapData(this.dataType, this.data);
    gl.bufferData(this.targetBufferType, bufferData, gl.STATIC_DRAW);
  }

  draw() {
    if (this.targetBufferType === gl.ARRAY_BUFFER) {
      gl.drawArrays(this.mode, 0, this.data.length / this.elementSize);
    } else if (this.targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
      gl.drawElements(this.mode, this.data.length, this.dataType, 0);
    }
  }
}

function wrapData(dataType: number, data: number[]) {
  switch (dataType) {
    case gl.FLOAT:
      return new Float32Array(data);
    case gl.INT:
      return new Int32Array(data);
    case gl.UNSIGNED_INT:
      return new Uint32Array(data);
    case gl.SHORT:
      return new Int16Array(data);
    case gl.UNSIGNED_SHORT:
      return new Uint16Array(data);
    case gl.BYTE:
      return new Int8Array(data);
    case gl.UNSIGNED_BYTE:
      return new Uint8Array(data);
    default:
      throw new Error('Unrecognize data type');
  }
}

function typeByDataType(dataType: number) {
  switch (dataType) {
    case gl.FLOAT:
    case gl.INT:
    case gl.UNSIGNED_INT:
      return 4;
    case gl.SHORT:
    case gl.UNSIGNED_SHORT:
      return 2;
    case gl.BYTE:
    case gl.UNSIGNED_BYTE:
      return 1;
    default:
      throw new Error('Unrecognize data type');
  }
}
