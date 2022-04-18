declare type IComponentData = {
  name: string;
  setFromJson(json: any): void;
};

declare type IComponentBuilder = {
  type: string;
  buildFromJson(json: any): IComponent;
};

// TODO update type
declare type IComponent = {
  name: string;
  setOwner(owner: any): void;
  load(): void;
  update(time: number): void;
  render(shader: any): void;
};
