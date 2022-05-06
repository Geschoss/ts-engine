import { CollisionComponent } from '../components/collision';
import { MessageBus } from '../message/bus';

export type CollisionData = {
  a: CollisionComponent;
  b: CollisionComponent;
  time: number;
};

export class CollisionManager {
  private static _totalTime: number = 0;
  private static _components: CollisionComponent[] = [];

  private static _collisionData: CollisionData[] = [];

  private constructor() {}

  public static registerComponent(component: CollisionComponent): void {
    CollisionManager._components.push(component);
  }

  public static unRegisterComponent(component: CollisionComponent): void {
    let index = CollisionManager._components.indexOf(component);
    if (index !== -1) {
      CollisionManager._components.slice(index, 1);
    }
  }

  public static clear(): void {
    CollisionManager._components.length = 0;
  }

  public static update(time: number): void {
    CollisionManager._totalTime += time;

    for (let c = 0; c < CollisionManager._components.length; ++c) {
      let comp = CollisionManager._components[c];
      for (let o = 0; o < CollisionManager._components.length; ++o) {
        let other = CollisionManager._components[o];

        // Do not check against collisions with self.
        if (comp === other) {
          continue;
        }

        if (comp.shape.intersects(other.shape)) {
          // We have a collision!
          let exists: boolean = false;
          for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
            let data = CollisionManager._collisionData[d];

            if (
              (data.a === comp && data.b === other) ||
              (data.a === other && data.b === comp)
            ) {
              // We have existing data. Update it.
              comp.onCollisionUpdate(other);
              other.onCollisionUpdate(comp);
              data.time = CollisionManager._totalTime;
              exists = true;
              break;
            }
          }

          if (!exists) {
            // Create a new collision.

            comp.onCollisionEntry(other);
            other.onCollisionEntry(comp);
            let col = {
              time: CollisionManager._totalTime,
              a: comp,
              b: other,
            };
            MessageBus.sendPiority('COLLISION_ENTRY:' + comp.name, col);
            MessageBus.sendPiority('COLLISION_ENTRY:' + other.name, col);
            this._collisionData.push(col);
          }
        }
      }
    }

    // Remove stale collision data.
    let removeData: CollisionData[] = [];
    for (let d = 0; d < CollisionManager._collisionData.length; ++d) {
      let data = CollisionManager._collisionData[d];
      if (data.time !== CollisionManager._totalTime) {
        // Old collision data.
        removeData.push(data);
      }
    }

    while (removeData.length !== 0) {
      // @ts-ignore
      let data: CollisionData = removeData.shift();
      let index = CollisionManager._collisionData.indexOf(data);
      CollisionManager._collisionData.splice(index, 1);

      data.a.onCollisionExit(data.b);
      data.b.onCollisionExit(data.a);
      MessageBus.sendPiority('COLLISION_EXIT:' + data.a.name, data);
      MessageBus.sendPiority('COLLISION_EXIT:' + data.b.name, data);
    }
  }
}
