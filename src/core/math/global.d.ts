declare type Vector3Json = Partial<{
  x: number;
  y: number;
  z: number;
}>;
declare type TransformJson = Partial<{
  position: Vector3Json;
  rotation: Vector3Json;
  scale: Vector3Json;
}>;
