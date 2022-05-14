import { isDefined } from '../../lib/ramda';
import { AnimatedSpriteComponentBuilder } from './animatedSprite';
import { BitmapTextComponentBuilder } from './bitmap';
import { CollisionComponentBuilder } from './collision';
import { SpriteComponentBuilder } from './sprite';

export class ComponentManager {
  private static registeredBuilders: Record<string, IComponentBuilder> = {};

  static registerBuilder(builder: IComponentBuilder) {
    ComponentManager.registeredBuilders[builder.type] = builder;
  }
  static extractComponent(json: any) {
    let type = json.type;
    if (!isDefined(type)) {
      throw new Error(`Component manager error - type is missining ${json}`);
    }
    let builder = ComponentManager.registeredBuilders[type];
    if (!isDefined(builder)) {
      throw new Error(`Cannot find builder by type: ${type}`);
    }
    return builder.buildFromJson(json);
  }
  static iinitialize() {
    ComponentManager.registerBuilder(new SpriteComponentBuilder());
    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
    ComponentManager.registerBuilder(new CollisionComponentBuilder());
    ComponentManager.registerBuilder(new BitmapTextComponentBuilder());
  }
}
