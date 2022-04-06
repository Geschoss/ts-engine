import { AssetManager } from './assetManaget';

export class ImageAsset implements IAsset {
  readonly name: string;
  readonly data: HTMLImageElement;
  constructor(name: string, data: HTMLImageElement) {
    this.name = name;
    this.data = data;
  }
  get width() {
    return this.data.width;
  }
  get height() {
    return this.data.height;
  }
}

export class ImageAssetLoader implements IAssetLoader {
  supportedExtensions: string[] = ['jpg', 'png', 'gif'];

  loadAsset(assetName: string) {
    let image = new Image();
    image.onload = this.onImageLoaded.bind(this, assetName, image);
    image.src = assetName;
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement) {
    console.log('onImageLoaded: assetName/image', assetName, image);
    let asset = new ImageAsset(assetName, image);
    AssetManager.onAssetLoader(asset);
  }
}
