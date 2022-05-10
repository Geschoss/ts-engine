import { isDefined } from '../../lib/ramda';
import { AudioManager } from '../audio/manager';
import { CollisionData } from '../collision/manager';
import { AnimatedSpriteComponent } from '../components/animatedSprite';
import { Vector2 } from '../math/vector2';
import { Vector3 } from '../math/vector3';
import { MessageBus } from '../message/bus';
import { BaseBehavoir } from './base';

export class PlayerBehaviorData implements IBehaviorData {
  name!: string;
  spriteName!: string;
  playerCollision!: string;
  groundCollision!: string;
  acceleration: Vector2 = new Vector2(0, 920);

  setFromJson(json: any): void {
    let name = json.name;
    if (!isDefined(name)) {
      throw new Error('Name must be defined in behavior data.');
    }
    this.name = String(name);

    let acceleration = json.acceleration;
    if (isDefined(acceleration)) {
      this.acceleration.setFromJson(acceleration);
    }

    let playerCollision = json.playerCollision;
    if (!isDefined(playerCollision)) {
      throw new Error('PlayerCollision must be defined in behavior data.');
    }
    this.playerCollision = String(playerCollision);

    let groundCollision = json.groundCollision;
    if (!isDefined(groundCollision)) {
      throw new Error('groundCollision must be defined in behavior data.');
    }
    this.groundCollision = String(groundCollision);

    let spriteName = json.spriteName;
    if (!isDefined(spriteName)) {
      throw new Error('spriteName must be defined in behavior data.');
    }
    this.spriteName = String(spriteName);
  }
}

export class PlayerBehavior extends BaseBehavoir {
  acceleration!: Vector2;
  sprite!: AnimatedSpriteComponent;

  spriteName!: string;
  playerCollision!: string;
  groundCollision!: string;

  isAlive = true;
  velocity: Vector2 = Vector2.zero();

  isPlaying = false;
  initialPosition = Vector3.zero();
  // TODO: move to conf
  pipeNames = [
    'pipe1Collision_end',
    'pipe1Collision_middle_top',
    'pipe1Collision_endneg',
    'pipe1Collision_middle_bottom',
  ];

  constructor(data: PlayerBehaviorData) {
    super(data);
    this.spriteName = data.spriteName;
    this.acceleration = data.acceleration;
    this.playerCollision = data.playerCollision;
    this.groundCollision = data.groundCollision;

    MessageBus.subscribe('GAME_RESET', () => {
      this.reset();
    });
    MessageBus.subscribe('GAME_START', () => {
      this.start();
    });

    MessageBus.subscribe('MOUSE_DOWN_EVENT', () => {
      this.onFlap();
    });
    MessageBus.subscribe(
      'COLLISION_ENTRY:' + this.playerCollision,
      (message) => {
        let data = message.context as CollisionData;
        if (
          data.a.name === this.groundCollision ||
          data.b.name === this.groundCollision
        ) {
          this.die();
          this.decelarate();
        }

        if (
          this.pipeNames.indexOf(data.a.name) !== -1 ||
          this.pipeNames.indexOf(data.b.name) !== -1
        ) {
          this.die();
        }
      }
    );
  }
  update(time: number) {
    let second = time / 1000;
    if (this.isPlaying) {
      this.velocity.add(this.acceleration.clone().scale(second));
    }

    // Limit max speed
    if (this.velocity.y > 400) {
      this.velocity.y = 400;
    }

    // Prevent flying too high
    if (this.owner.transform.position.y < -13) {
      this.owner.transform.position.y = -13;
      this.velocity.y = 0;
    }

    this.owner.transform.position.add(
      this.velocity.clone().scale(second).toVector3()
    );
    if (this.velocity.y < 0) {
      this.owner.transform.rotation.z -= Math.degToRad(600.0) * second;
      if (this.owner.transform.rotation.z < Math.degToRad(-20)) {
        this.owner.transform.rotation.z = Math.degToRad(-20);
      }
    }
    if (!this.isAlive || this.isFalling()) {
      this.owner.transform.rotation.z += Math.degToRad(480.0) * second;
      if (this.owner.transform.rotation.z > Math.degToRad(90)) {
        this.owner.transform.rotation.z = Math.degToRad(90);
      }
    }
    if (this.shouldNotFlap()) {
      this.sprite.stop();
    } else if (!this.sprite.isPlaying()) {
      this.sprite.play();
    }

    super.update(time);
  }
  updateReady() {
    super.updateReady();

    this.sprite = this.owner.getComponentByname(
      this.spriteName
    ) as AnimatedSpriteComponent;

    if (!isDefined(this.sprite)) {
      throw new Error(
        `AnimatedSpriteComponent named '${this.spriteName}' is not attached to the owner of this component`
      );
    }
    // Make sure the animation plays right away
    this.sprite.setFrame(0);
    this.initialPosition.copyFrom(this.owner.transform.position);
  }

  reset() {
    this.isAlive = true;
    this.isPlaying = false;
    this.sprite.owner.transform.position.copyFrom(this.initialPosition);
    this.sprite.owner.transform.rotation.z = 0;

    this.velocity.set(0, 0);
    this.acceleration.set(0, 920);
    this.sprite.play();
  }

  start() {
    this.isPlaying = true;
    MessageBus.send('PLAYER_RESET');
  }

  isFalling() {
    return this.velocity.y > 220.0;
  }
  shouldNotFlap() {
    return this.isPlaying || this.velocity.y > 220.0 || !this.isAlive;
  }
  die() {
    if (this.isAlive) {
      this.isAlive = false;
      AudioManager.playSound('dead');
      MessageBus.send('PLAYER_DIED', this);
    }
  }
  decelarate() {
    this.acceleration.y = 0;
    this.velocity.y = 0;
  }
  onFlap() {
    if (this.isAlive && this.isPlaying) {
      this.velocity.y = -280;
      AudioManager.playSound('flap');
    }
  }
  onRestart(y: number) {
    this.owner.transform.rotation.z = 0;
    this.owner.transform.position.set(33, y);
    this.velocity.set(0, 0);
    this.acceleration.set(0, 920);
    this.sprite.play();
  }
}

export class PlayerBehaviorBuilder implements IBehaviorBuilder {
  type = 'player';
  buildFromJson(json: any): IBehavior {
    let data = new PlayerBehaviorData();
    data.setFromJson(json);
    return new PlayerBehavior(data);
  }
}
