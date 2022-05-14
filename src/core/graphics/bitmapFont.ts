import { isDefined } from '../../lib/ramda';
import {
  AssetManager,
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/manager';
import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';

interface IFontGlyph {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  xOffset: number;
  yOffest: number;
  xAdvance: number;
  page: number;
  channel: number;
}

export class FontGlyph {
  static extractNumber(field: string) {
    return Number(FontGlyph.extractString(field));
  }
  static extractString(field: string) {
    return field.split('=')[1];
  }
  static fromFields(fields: string[]): IFontGlyph {
    return {
      id: FontGlyph.extractNumber(fields[1]),
      x: FontGlyph.extractNumber(fields[2]),
      y: FontGlyph.extractNumber(fields[3]),
      width: FontGlyph.extractNumber(fields[4]),
      height: FontGlyph.extractNumber(fields[5]),
      xOffset: FontGlyph.extractNumber(fields[6]),
      yOffest: FontGlyph.extractNumber(fields[7]),
      xAdvance: FontGlyph.extractNumber(fields[8]),
      page: FontGlyph.extractNumber(fields[9]),
      channel: FontGlyph.extractNumber(fields[10]),
    };
  }
}

export class BitmapFont {
  name!: string;
  size!: number;
  imageFile!: string;
  imageWidth!: number;
  imageHight!: number;
  fontFileName!: string;

  assetLoaded = false;
  glyphs: Record<number, IFontGlyph> = {};

  constructor(name: string, fontFileName: string) {
    this.name = name;
    this.fontFileName = fontFileName;
  }

  load() {
    let asset = AssetManager.get<string>(this.fontFileName);
    if (isDefined(asset)) {
      this.processFontFile(asset.data);
    } else {
      MessageBus.subscribe(
        MESSAGE_ASSET_LOADER_ASSET_LOADED + this.fontFileName,
        (message: IMessage) => {
          this.processFontFile(message.context.data);
        }
      );
    }
  }
  getGlyph(char: string): IFontGlyph {
    // Replace unrecognized characters with a '?'.
    let code = char.charCodeAt(0);
    return this.glyphs[code] || 63;
  }
  measureText(text: string): Vector2 {
    let size = Vector2.zero();
    let maxX = 0;
    let x = 0;
    let y = 0;
    for (let c of text) {
      switch (c) {
        case '\n':
          if (x > maxX) {
            maxX = x;
          }
          x = 0;
          y += this.size;
          break;
        default:
          x += this.getGlyph(c).xAdvance;
          break;
      }
    }
    size.set(maxX, y);
    return size;
  }

  private processFontFile(content: string) {
    let charCount = 0;
    let lines = content.split('\n');
    for (let line of lines) {
      // Sanitaze the line
      let data = line.replace(/\s\s+/g, ' ');
      let fields = data.split(' ');
      // Look at rhe type of line
      switch (fields[0]) {
        case 'info':
          this.size = FontGlyph.extractNumber(fields[2]);
          break;
        case 'common':
          this.imageWidth = FontGlyph.extractNumber(fields[3]);
          this.imageHight = FontGlyph.extractNumber(fields[4]);
          break;
        case 'page':
          {
            let id = FontGlyph.extractNumber(fields[1]);
            this.imageFile = FontGlyph.extractString(fields[2]).replace(
              /"/g,
              ''
            );
            // Prepand the path to the image name.
            // TODO: move to conf
            this.imageFile = ('assets/fonts/' + this.imageFile).trim();
          }
          break;
        case 'chars':
          charCount = FontGlyph.extractNumber(fields[1]);
          charCount++;
          break;
        case 'char':
          {
            let glyph = FontGlyph.fromFields(fields);
            this.glyphs[glyph.id] = glyph;
          }
          break;
      }
    }

    let actualGlyphCount = 0;
    let keys = Object.keys(this.glyphs);
    for (let key of keys) {
      if (Object.hasOwn(this.glyphs, key)) {
        actualGlyphCount++;
      }
    }
    if (actualGlyphCount !== charCount) {
      throw new Error(`Font file reported existenca`);
    }
    this.assetLoaded = true;
  }
}
