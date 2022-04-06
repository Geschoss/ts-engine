import { Message } from '../message/message';
import { ImageAssetLoader } from './imageAssetLoader';

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

export class AssetManager {
  private static loaders: IAssetLoader[] = [];
  private static loadedAssets: Map<string, IAsset> = new Map();

  private constructor() {}

  static initialize() {
    AssetManager.loaders.push(new ImageAssetLoader());
  }

  static registerLoader(loader: IAssetLoader) {
    AssetManager.loaders.push(loader);
  }
  static loadAsset(assetName: string) {
    let extension = assetName.split('.').pop()?.toLocaleLowerCase();
    if (!extension)
      throw new Error(`File has not extension. name ${assetName}`);

    for (let l of AssetManager.loaders) {
      if (l.supportedExtensions.indexOf(extension) !== -1) {
        l.loadAsset(assetName);
        return;
      }
    }

    console.warn(`Unable to load asset with name ${assetName}`);
  }

  static onAssetLoader(asset: IAsset) {
    AssetManager.loadedAssets.set(asset.name, asset);
    Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
  }

  static isAssetLoaded(assetName: string) {
    return AssetManager.loadedAssets.has(assetName);
  }

  static getAsset(assetName: string) {
    if (AssetManager.isAssetLoaded(assetName)) {
      return AssetManager.loadedAssets.get(assetName);
    } else {
      AssetManager.loadAsset(assetName);
    }
    return undefined;
  }
}
