import { MessageBus } from '../message/bus';
import { ImageLoader } from './imageLoader';
import { JsonLoader } from './jsonLoader';
import { TextLoader } from './textLoader';

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  'MESSAGE_ASSET_LOADER_ASSET_LOADED::';

type ManagerConf = {
  loaders: IAssetLoader[];
  loadedAssets: Map<string, IAsset<unknown>>;
};

export const AssetManager = managerSDK({
  loaders: [],
  loadedAssets: new Map<string, IAsset<unknown>>(),
});

function managerSDK({ loaders, loadedAssets }: ManagerConf) {
  const isLoaded = (assetName: string) => loadedAssets.has(assetName);
  const register = (loader: IAssetLoader) => loaders.push(loader);

  const initialize = () => {
    AssetManager.register(new ImageLoader());
    AssetManager.register(new JsonLoader());
    AssetManager.register(new TextLoader());
  };

  const load = (assetName: string) => {
    let extension = assetName.split('.').pop()?.toLocaleLowerCase();
    if (!extension)
      throw new Error(`File has not extension. name ${assetName}`);

    for (let l of loaders) {
      if (l.supportedExtensions.indexOf(extension) !== -1) {
        l.load(assetName);
        return;
      }
    }

    console.warn(`Unable to load asset with name ${assetName}`);
  };

  const onLoaded = (asset: IAsset<unknown>) => {
    loadedAssets.set(asset.name, asset);
    MessageBus.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, asset);
  };

  const get = <T>(assetName: string) => {
    if (isLoaded(assetName)) {
      return loadedAssets.get(assetName) as IAsset<T>;
    } else {
      load(assetName);
    }
    return undefined;
  };

  return {
    get,
    load,
    register,
    onLoaded,
    isLoaded,
    initialize,
  };
}
