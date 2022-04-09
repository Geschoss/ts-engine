import { Color } from './color';
import { Texture } from './texture';
import { TextureManager } from './textureManager';

export class Material {
  name: string;
  diffuseTexture: Texture;
  tint: Color;
  _diffuseTextureName: string;

  constructor(name: string, diffuseTextureName: string, tint: Color) {
    this.name = name;
    this.tint = tint;
    this._diffuseTextureName = diffuseTextureName;

    this.diffuseTexture = TextureManager.getTexture(this._diffuseTextureName);
  }

  get diffuseTextureName() {
    return this._diffuseTextureName
  }
}
