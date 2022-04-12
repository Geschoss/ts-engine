import { SpriteComponent } from '../components/spriteComponent';
import { SimObject } from './simObject';
import { Zone } from './zone';

export class TestZone extends Zone {
  parentObject!: SimObject;
  parentSprite!: SpriteComponent;
  testObject!: SimObject;
  testSprite!: SpriteComponent;

  load() {
    this.parentObject = new SimObject(0, 'parentObject', this.scene);
    this.parentSprite = new SpriteComponent('test', 'wood');
    this.parentObject.addComponent(this.parentSprite);
    this.parentObject.transform.position.x = 200;
    this.parentObject.transform.position.y = 200;

    this.testObject = new SimObject(1, 'testObject', this.scene);
    this.testSprite = new SpriteComponent('test', 'crate');
    this.testObject.addComponent(this.testSprite);
    this.testObject.transform.position.x = 30;
    this.testObject.transform.position.y = 30;

    this.parentObject.addChild(this.testObject);

    this.scene.addObject(this.parentObject);
    super.load();
  }

  update(time: number) {
    this.parentObject.transform.rotation.z +=0.005;
    this.testObject.transform.rotation.z -=0.03;
    super.update(time);
  }
}
