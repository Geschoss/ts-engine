declare interface IBehavior {
  name: string;
  setOwner(owner: any): void;
  update(time: number): void;
  apply(userData: any): void;
}

declare interface IBehaviorBuilder {
  type: string;
  buildFromJson(json: any): IBehavior;
}

declare interface IBehaviorData {
  name: string;
  setFromJson(json: any): void;
}
