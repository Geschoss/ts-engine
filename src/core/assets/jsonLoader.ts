import { AssetManager } from './manager';

export class JsonAsset implements IAsset {
  name: string;
  data: any;

  constructor(name: string, data: any) {
    this.name = name;
    this.data = data;
  }
}

export class JsonLoader implements IAssetLoader {
  supportedExtensions: string[] = ['json'];

  load(assetName: string) {
    let request = new XMLHttpRequest();
    request.open('GET', assetName);
    request.addEventListener(
      'load',
      this.onJsonLoaded.bind(this, assetName, request)
    );
    request.send();
  }

  private onJsonLoaded(assetName: string, request: XMLHttpRequest) {
    console.log('onJsonLoaded: assetName/request', assetName, request);
    if (request.readyState === request.DONE) {
      let json = JSON.parse(request.responseText);
      let asset = new JsonAsset(assetName, json);
      AssetManager.onLoaded(asset);
    }
  }
}
