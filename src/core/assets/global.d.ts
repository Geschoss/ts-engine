declare interface IAsset<D = any> {
  readonly name: string;
  readonly data: D;
}

declare interface IAssetLoader {
  readonly supportedExtensions: string[];
  load(assetName: string): void;
}
