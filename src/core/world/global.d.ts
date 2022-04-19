declare type IComponentsJson = Partial<{
  name: string;
  type: string;
  materialName: string;
}>;
declare type IBehaviorJson = Partial<{
  name: string;
  type: string;
  rotation: {
    z: number;
    x: number;
    y: number;
  };
}>;
declare type ISimObjectJson = Partial<{
  name?: string;
  transform?: TransformJson;
  children?: ISimObjectJson[];
  components?: IComponentsJson[];
  behaviors?: IBehaviorJson[];
}>;
declare type IZoneData = {
  objects?: ISimObjectJson[];
};
