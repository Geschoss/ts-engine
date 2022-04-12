import { Shader } from '../gl/shaders/shader';
import { Sprite } from '../graphics/sprite';
import { BaseComponent } from './baseComponent';

export class SpriteComponent extends BaseComponent {
  sprite: Sprite;
  constructor(name: string, materialName: string) {
    super(name);
    this.sprite = new Sprite(name, materialName);
  }
  load() {
    this.sprite.load();
    super.load();
  }
  render(shader: Shader) {
    this.sprite.draw(shader, this.owner.worldMatrix);

    super.render(shader);
  }
}
