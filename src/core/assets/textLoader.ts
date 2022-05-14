import { AssetManager } from './manager';

export class TextAsset implements IAsset {
  name: string;
  data: string;

  constructor(name: string, data: string) {
    this.name = name;
    this.data = data;
  }
}

export class TextLoader implements IAssetLoader {
  supportedExtensions = ['txt'];
  load(assetName: string): void {
    let request = new XMLHttpRequest();
    request.open('GET', assetName);
    request.addEventListener(
      'load',
      this.onLoaded.bind(this, assetName, request)
    );
    request.send();
  }

  onLoaded(assetName: string, request: XMLHttpRequest) {
    console.debug('onLoaded', assetName);
    if (request.readyState === request.DONE) {
      let asset = new TextAsset(assetName, request.responseText);
      AssetManager.onLoaded(asset);
    }
  }
}
