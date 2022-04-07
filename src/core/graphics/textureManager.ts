import { Texture } from './texture';

class TextureReferenceNode {
  texture: Texture;
  referenceCount: number = 1;
  constructor(texture: Texture) {
    this.texture = texture;
  }
}

export class TextureManager {
  private static textures: Record<string, TextureReferenceNode> = {};
  private constructor() {}

  static getTexture(textureName: string) {
    let textureNode = TextureManager.textures[textureName];
    if (textureNode) {
      textureNode.referenceCount++;
      return textureNode.texture;
    }

    const texture = new Texture(textureName);
    textureNode = new TextureReferenceNode(texture);
    TextureManager.textures[textureName] = textureNode;

    return texture;
  }

  static releaseTexture(textureName: string) {
    let textureNode = TextureManager.textures[textureName];
    if (!textureNode) {
      console.warn(
        `A texture name ${textureName} does not exist and cannot be realeased`
      );
    } else {
      TextureManager.textures[textureName].referenceCount++;
      if (TextureManager.textures[textureName].referenceCount < 1) {
        TextureManager.textures[textureName].texture.destroy();
        delete TextureManager.textures[textureName];
      }
    }
  }
}
