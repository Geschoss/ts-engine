declare interface IAsset<D> {
  readonly name: string;
  readonly data: D;
}

declare interface IAssetLoader {
  readonly supportedExtensions: string[];
  load(assetName: string): void;
}
