import { ImageAsset } from '../assets/imageLoader';
import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from '../assets/manager';
import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';
import { Sprite } from './sprite';

class UVInfo {
  min: Vector2;
  max: Vector2;
  constructor(min: Vector2, max: Vector2) {
    this.min = min;
    this.max = max;
  }
}

export class AnimatedSprite extends Sprite {
  frameHeight: number;
  frameWidth: number;
  frameCount: number;
  frameSequence: number[];
  // TODO: Make this conf
  frameTime: number = 300;
  frameUVs: UVInfo[] = [];

  currentFrame: number = 0;
  currentTime: number = 0;
  assetLoaded = false;
  assetWidth = 2;
  assetHeight = 2;

  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100,
    frameWidth: number = 10,
    frameHeight: number = 10,
    frameCount: number = 1,
    frameSequence: number[] = []
  ) {
    super(name, materialName, width, height);
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    this.frameCount = frameCount;
    this.frameSequence = frameSequence;

    MessageBus.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this.material.diffuseTextureName,
      this.onMessage.bind(this)
    );
  }

  destroy() {
    super.destroy();
  }

  onMessage(message: IMessage) {
    if (
      message.code ===
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this.material.diffuseTextureName
    ) {
      let asset = message.context as ImageAsset;
      this.assetWidth = asset.width;
      this.assetHeight = asset.height;
      this.calculateUVs();
      this.assetLoaded = true;
    }
  }

  load() {
    super.load();
  }

  update(time: number) {
    if (!this.assetLoaded) {
      return;
    }
    this.currentTime += time;
    if (this.currentTime > this.frameTime) {
      this.currentFrame++;
      this.currentTime = 0;
      if (this.currentFrame >= this.frameSequence.length) {
        this.currentFrame = 0;
      }
      let UVMin = this.frameUVs[this.frameSequence[this.currentFrame]].min;
      let UVMax = this.frameUVs[this.frameSequence[this.currentFrame]].max;
      this.vertices[0].textCoords.copyFrom(UVMin);
      this.vertices[1].textCoords = new Vector2(UVMin.x, UVMax.y);
      this.vertices[2].textCoords.copyFrom(UVMax);
      this.vertices[3].textCoords.copyFrom(UVMax);
      this.vertices[4].textCoords = new Vector2(UVMax.x, UVMin.y);
      this.vertices[5].textCoords.copyFrom(UVMin);

      this.buffer.clearData();
      for (let v of this.vertices) {
        this.buffer.pushBackData(v.toArray());
      }
      this.buffer.upload();
      this.buffer.unbind();
    }

    super.update(time);
  }

  private calculateUVs() {
    let totalWidth = 0;
    let yValue = 0;
    for (let i = 0; i < this.frameCount; ++i) {
      totalWidth += i * this.frameWidth;
      if (totalWidth > this.assetWidth) {
        yValue++;
        totalWidth = 0;
      }

      let u = (i * this.frameWidth) / this.assetWidth;
      let v = (yValue * this.frameHeight) / this.assetHeight;
      let min = new Vector2(u, v);

      let uMax = (i * this.frameWidth + this.frameWidth) / this.assetWidth;
      let vMax =
        (yValue * this.frameHeight + this.frameHeight) / this.assetHeight;
      let max = new Vector2(uMax, vMax);

      this.frameUVs.push(new UVInfo(min, max));
    }
  }
}
