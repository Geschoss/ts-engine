import { isDefined } from '../../lib/ramda';
import { Shader } from '../gl/shaders/shader';
import { BitmapText } from '../graphics/bitmapText';
import { Vector3 } from '../math/vector3';
import { MessageBus } from '../message/bus';
import { BaseComponent } from './base';

export class BitmapTextComponentData implements IComponentData {
  name!: string;
  text!: string;
  fontName!: string;
  origin = Vector3.zero();

  setFromJson(json: any): void {
    let name = json.name;
    if (isDefined(name)) {
      this.name = name;
    }
    let fontName = json.fontName;
    if (isDefined(fontName)) {
      this.fontName = fontName;
    }
    let origin = json.origin;
    if (isDefined(origin)) {
      this.origin.setFromJson(origin);
    }
    let text = json.text;
    if (isDefined(text)) {
      this.text = text;
    }
  }
}

export class BitmapTextComponentBuilder implements IComponentBuilder {
  type = 'bitmapText';
  buildFromJson(json: any): IComponent {
    let data = new BitmapTextComponentData();
    data.setFromJson(json);
    return new BitmapTextComponent(data);
  }
}

export class BitmapTextComponent extends BaseComponent {
  bitmapText: BitmapText;
  fontName: string;
  constructor(data: BitmapTextComponentData) {
    super(data);
    this.fontName = data.fontName;
    this.bitmapText = new BitmapText(this.name, this.fontName);
    if (!data.origin.equals(Vector3.zero())) {
      this.bitmapText.origin.copyFrom(data.origin);
    }
    this.bitmapText.text = data.text;

    MessageBus.subscribe(this.name + ':SetText', (message) => {
      this.bitmapText.text = String(message.context);
    });
  }
  load() {
    this.bitmapText.load();
    super.load();
  }
  update(time: number) {
    this.bitmapText.update(time);
  }
  render(shader: Shader) {
    this.bitmapText.draw(shader, this.owner.worldMatrix);
    super.render(shader);
  }
}
