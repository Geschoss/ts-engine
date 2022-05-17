import { SimObject } from '../world/simObject';

export abstract class BaseBehavior implements IBehavior {
  name: string;
  owner!: SimObject;
  protected data: IBehaviorData;
  constructor(data: IBehaviorData) {
    this.data = data;
    this.name = data.name;
  }
  
  setOwner(owner: SimObject) {
    this.owner = owner;
  }
  updateReady() {}
  update(time: number) {}
  apply(userData: any) {}
}
