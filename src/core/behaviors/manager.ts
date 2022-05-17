import { isDefined } from '../../lib/ramda';
import { KeyboardBehaviorBuilder } from './keyboard';
import { MouseClickBehaviorBuilder } from './mouse';
import { PlayerBehaviorBuilder } from './player';
import { RotationBehaviorBuilder } from './rotation';
import { ScrollBehaviorBuilder } from './scroll';
import { VisibilityOnMessageBehaviorBuilder } from './visibilityOnMessage';

export class BehaviorManager {
  private static registeredBuilders: Record<string, IBehaviorBuilder> = {};

  static registerBuilder(builder: IBehaviorBuilder) {
    BehaviorManager.registeredBuilders[builder.type] = builder;
  }
  static extractBehavior(json: any) {
    let type = json.type;
    if (!isDefined(type)) {
      throw new Error(`Behavior manager error - type is missining ${json}`);
    }
    let builder = BehaviorManager.registeredBuilders[type];
    if (!isDefined(builder)) {
      throw new Error(`Cannot find builder by type: ${type}`);
    }
    return builder.buildFromJson(json);
  }
  static iinitialize() {
    BehaviorManager.registerBuilder(new RotationBehaviorBuilder());
    BehaviorManager.registerBuilder(new KeyboardBehaviorBuilder());
    BehaviorManager.registerBuilder(new PlayerBehaviorBuilder());
    BehaviorManager.registerBuilder(new ScrollBehaviorBuilder());
    BehaviorManager.registerBuilder(new MouseClickBehaviorBuilder());
    BehaviorManager.registerBuilder(new VisibilityOnMessageBehaviorBuilder());
  }
}
