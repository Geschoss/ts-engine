import { isDefined } from '../../lib/ramda';
import { GLBuffer } from '../gl/glBuffer';
import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Vector3 } from '../math/vector3';
import { BitmapFont } from './bitmapFont';
import { BitmapFontManager } from './bitmapManager';
import { Color } from './color';
import { Material } from './material';
import { Vertex } from './vertex';

export class BitmapText {
  fontName: string;
  name: string;
  buffer!: GLBuffer;
  material!: Material;
  bitmapFont!: BitmapFont;
  _text!: string;

  isDirty = false;
  origin = Vector3.zero();
  vertices: Vertex[] = [];
  constructor(name: string, fontName: string) {
    this.name = name;
    this.fontName = fontName;
  }

  public get text(): string {
    return this._text;
  }

  public set text(value: string) {
    if (this._text !== value) {
      this._text = value;
      this.isDirty = true;
    }
  }

  destory() {
    this.buffer.destroy();
    this.material.destroy();
    this.material = undefined;
  }

  load() {
    this.bitmapFont = BitmapFontManager.get(this.fontName);
    this.material = new Material(
      `BITMAP_FONT_${this.name}_${this.bitmapFont.size}`,
      this.bitmapFont.imageFile,
      Color.white()
    );
    this.buffer = new GLBuffer();
    this.buffer.addAtributeLocation({
      location: 0,
      size: 3,
    });
    this.buffer.addAtributeLocation({
      location: 1,
      size: 2,
    });
  }

  update(time: number) {
    if (this.isDirty && this.bitmapFont.assetLoaded) {
      this.calculateVertices();
      this.isDirty = false;
    }
  }

  draw(shader: Shader, model: Matrix4x4) {
    let modelLocation = shader.getUniformLocation('u_model');
    gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());
    let colorLocation = shader.getUniformLocation('u_tint');
    gl.uniform4fv(colorLocation, this.material.tint.toFloat32Array());
    if (isDefined(this.material.diffuseTexture)) {
      this.material.diffuseTexture.activateAndBind(0);
      let diffuseLocation = shader.getUniformLocation('u_diffuse');
      gl.uniform1i(diffuseLocation, 0);
    }
    this.buffer.bind();
    this.buffer.draw();
  }

  calculateVertices() {
    this.vertices.length = 0;
    this.buffer.clearData();
    let x = 0;
    let y = 0;
    for (let c of this.text) {
      if (c === '\n') {
        x = 0;
        y += this.bitmapFont.size;
        continue;
      }

      let g = this.bitmapFont.getGlyph(c);
      let minX = x + g.xOffset;
      let minY = y + g.yOffest;
      let maxX = minX + g.width;
      let maxY = minX + g.height;

      let minU = g.x / this.bitmapFont.imageWidth;
      let minV = g.y / this.bitmapFont.imageHight;
      let maxU = (g.x + g.width) / this.bitmapFont.imageWidth;
      let maxV = (g.y + g.height) / this.bitmapFont.imageHight;

      this.vertices.push(new Vertex(minX, minY, 0, minU, minV));
      this.vertices.push(new Vertex(minX, maxY, 0, minU, maxV));
      this.vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
      this.vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
      this.vertices.push(new Vertex(maxX, minY, 0, maxU, minV));
      this.vertices.push(new Vertex(minX, minY, 0, minU, minV));

      x += g.xAdvance;
    }

    for (let v of this.vertices) {
      this.buffer.pushBackData(v.toArray());
    }
    this.buffer.upload();
    this.buffer.unbind();
  }
}
