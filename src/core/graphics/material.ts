import { Color } from './color';
import { Texture } from './texture';
import { TextureManager } from './textureManager';

export class Material {
  name: string;
  tint: Color;
  diffuseTexture: Texture;
  _diffuseTextureName: string;

  constructor(name: string, diffuseTextureName: string, tint: Color) {
    this.name = name;
    this.tint = tint;
    this._diffuseTextureName = diffuseTextureName;

    this.diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
  }

  get diffuseTextureName() {
    return this._diffuseTextureName;
  }
  set diffuseTextureName(value: string) {
    this._diffuseTextureName = value;
    this.diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
  }

  destroy() {
    TextureManager.releaseTexture(this._diffuseTextureName);
    // @ts-ignore
    this.diffuseTexture = undefined;
  }
}
