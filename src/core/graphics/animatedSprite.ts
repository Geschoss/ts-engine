import { ImageAsset } from '../assets/imageLoader';
import {
  AssetManager,
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/manager';
import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';
import { MaterialManager } from './materialManager';
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
  frameTime: number = 33;
  frameUVs: UVInfo[] = [];

  currentFrame = 0;
  currentTime = 0;
  assetLoaded = false;
  assetWidth = 2;
  assetHeight = 2;
  isPlaying = false;

  constructor(
    name: string,
    materialName: string,
    width: number = 100,
    height: number = 100,
    frameWidth: number = 10,
    frameHeight: number = 10,
    frameCount: number = 1,
    frameSequence: number[] = [],
    frameTime: number = 60,
  ) {
    super(name, materialName, width, height);
    this.frameHeight = frameHeight;
    this.frameWidth = frameWidth;
    this.frameCount = frameCount;
    this.frameSequence = frameSequence;
    this.frameTime = frameTime;

    MessageBus.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this.material.diffuseTextureName,
      this.onMessage.bind(this)
    );
  }

  play() {
    this.isPlaying = true;
  }
  stop() {
    this.isPlaying = false;
  }

  setFrame(frameNumber: number) {
    if (frameNumber >= this.frameCount) {
      throw new Error('Frame is out of range');
    }
    this.currentFrame = frameNumber;
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
      this.updateVertices();
    }
  }

  load() {
    super.load();
    if (!this.assetLoaded) {
      this.setupFromMaterial();
    }
  }

  update(time: number) {
    if (!this.isPlaying) {
      return;
    }
    if (!this.assetLoaded) {
      this.setupFromMaterial();
      return;
    }
    this.currentTime += time;
    if (this.currentTime > this.frameTime) {
      this.currentFrame++;
      this.currentTime = 0;
      if (this.currentFrame >= this.frameSequence.length) {
        this.currentFrame = 0;
      }
      this.updateVertices();
    }

    super.update(time);
  }

  private updateVertices() {
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

  setupFromMaterial() {
    if (!this.assetLoaded) {
      let material = MaterialManager.get(this.materialName);
      if (material.diffuseTexture.loaded) {
        if (AssetManager.isLoaded(material.diffuseTextureName)) {
          this.assetHeight = material.diffuseTexture.height;
          this.assetWidth = material.diffuseTexture.width;
          this.assetLoaded = true;
          this.calculateUVs();
          this.updateVertices();
        }
      }
    }
  }
}
