import { isDefined } from '../../lib/ramda';
import { BitmapFont } from './bitmapFont';

export class BitmapFontManager {
  static fonts: Record<string, BitmapFont> = {};
  static add(name: string, fontFileName: string) {
    BitmapFontManager.fonts[name] = new BitmapFont(name, fontFileName);
  }
  static get(name: string) {
    let font = BitmapFontManager.fonts[name];
    if (!isDefined(font)) {
      throw new Error(`Cannot fint font ${name}`);
    }
    return font;
  }
  static load() {
    for (let font of Object.values(BitmapFontManager.fonts)) {
      font.load();
    }
  }
  static updateReady() {
    for (let font of Object.values(BitmapFontManager.fonts)) {
      if (!font.assetLoaded) {
        console.debug(`Font ${font.name} is still loading!`);
        return false;
      }
    }
    return true;
  }
}
