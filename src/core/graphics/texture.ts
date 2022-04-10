import {
  AssetManager,
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/manager';
import { ImageAsset } from '../assets/imageLoader';
import { MessageBus } from '../message/bus';

const LEVEL = 0;
const BORDER = 0;
const TEMP_IMAGE_DATA = new Uint8Array([255, 255, 255, 255]);

export class Texture {
  private handle: WebGLTexture;
  loaded: boolean = false;
  name: string;
  width: number;
  height: number;

  constructor(name: string, width: number = 1, height: number = 1) {
    this.name = name;
    this.width = width;
    this.height = height;

    const handle = gl.createTexture();
    if (!handle) throw new Error(`Cannot create texture ${name}`);
    this.handle = handle;

    MessageBus.subscribe(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + this.name,
      this.onMessage.bind(this)
    );

    this.bind();
    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      1,
      1,
      BORDER,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      TEMP_IMAGE_DATA
    );
    let asset = AssetManager.get(this.name) as ImageAsset;
    if (asset !== undefined) {
      this.loadTextureFromAsset(asset);
    }
  }

  onMessage(message: IMessage) {
    if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.name) {
      this.loadTextureFromAsset(message.context);
    }
  }

  bind() {
    gl.bindTexture(gl.TEXTURE_2D, this.handle);
  }

  unbind() {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  activateAndBind(textureUnit: number = 0) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    this.bind();
  }

  destroy() {
    gl.deleteTexture(this.handle);
  }

  private loadTextureFromAsset(asset: ImageAsset) {
    this.width = asset.width;
    this.height = asset.height;

    this.bind();

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      asset.data
    );

    if (this.isPowerof2()) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // Do not generate a mip map and clamp wrapping to edge.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    this.loaded = true;
  }

  private isPowerof2() {
    return (
      this.isValuePowerOf2(this.width) && this.isValuePowerOf2(this.height)
    );
  }

  private isValuePowerOf2(value: number) {
    return (value & (value - 1)) == 0;
  }
}
