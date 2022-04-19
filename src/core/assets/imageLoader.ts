import { AssetManager } from './manager';

export class ImageAsset implements IAsset<HTMLImageElement> {
  name: string;
  data: HTMLImageElement;

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

export class ImageLoader implements IAssetLoader {
  supportedExtensions: string[] = ['jpg', 'jpeg', 'png', 'gif'];

  load(assetName: string) {
    let image = new Image();
    image.onload = this.onImageLoaded.bind(this, assetName, image);
    image.src = assetName;
  }

  private onImageLoaded(assetName: string, image: HTMLImageElement) {
    let asset = new ImageAsset(assetName, image);
    AssetManager.onLoaded(asset);
  }
}
