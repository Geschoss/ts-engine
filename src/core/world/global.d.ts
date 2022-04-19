declare type IComponentsJson = Partial<{
  name: string;
  type: string;
  materialName: string;
}>;
declare type ISimObjectJson = Partial<{
  name?: string;
  transform?: TransformJson;
  children?: ISimObjectJson[];
  components?: IComponentsJson[];
}>;
declare type IZoneData = {
  objects?: ISimObjectJson[];
};
