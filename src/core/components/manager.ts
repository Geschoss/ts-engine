export class ComponentManager {
  private static registeredBuilders: Record<string, IComponentBuilder> = {};
  static registerBuilder(builder: IComponentBuilder) {
    ComponentManager.registeredBuilders[builder.type] = builder;
  }
  static extractComponent(json: any) {
    let type = json.type;
    if (type == undefined) {
      throw new Error(`Component manager error - type is missining ${json}`);
    }
    let builder = ComponentManager.registeredBuilders[type];
    if (builder == undefined) {
      console.warn(`Cannot find builder by type: ${type}`);
    }
    return builder.buildFromJson(json);
  }
}
