import { JsonAsset } from '../assets/jsonLoader';
import {
  AssetManager,
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from '../assets/manager';
import { Shader } from '../gl/shaders/shader';
import { MessageBus } from '../message/bus';
import { Zone } from './zone';

export class ZoneManager {
  private static globalZoneID: number = -1;
  //private static _zones: { [id: number]: Zone } = {};
  private static registeredZones: Record<number, string> = {};
  private static activeZone?: Zone;

  private constructor() {}

  public static initialize() {
    ZoneManager.registeredZones[0] = 'assets/zones/testZone.json';
  }

  public static changeZone(id: number) {
    if (ZoneManager.activeZone !== undefined) {
      ZoneManager.activeZone.onDeactivated();
      ZoneManager.activeZone.unload();
      ZoneManager.activeZone = undefined;
    }

    let zonePath = ZoneManager.registeredZones[id];
    if (zonePath !== undefined) {
      if (AssetManager.isLoaded(zonePath)) {
        let asset = AssetManager.get(zonePath);
        if (asset) {
          ZoneManager.loadZone(asset);
        } else {
          console.log(`Cant't find asset by id: ${id}`);
        }
      } else {
        let code = MESSAGE_ASSET_LOADER_ASSET_LOADED + zonePath; 
        MessageBus.subscribe(
          code,
          ZoneManager.onMessage.bind(this, code)
        );
        AssetManager.load(zonePath);
      }
    } else {
      throw new Error(`Zone id: ${id} does not exist.`);
    }
  }

  public static update(time: number): void {
    if (ZoneManager.activeZone !== undefined) {
      ZoneManager.activeZone.update(time);
    }
  }

  public static render(shader: Shader): void {
    if (ZoneManager.activeZone !== undefined) {
      ZoneManager.activeZone.render(shader);
    }
  }

  public static onMessage(code: string, message: IMessage): void {
    if (message.code === code) {
      let asset = message.context as JsonAsset;
      ZoneManager.loadZone(asset);
    }
  }

  private static loadZone(asset: JsonAsset): void {
    let zoneData = asset.data;
    let zoneId: number;
    if (zoneData.id === undefined) {
      throw new Error('Zone file format exception: Zone id not present.');
    } else {
      zoneId = Number(zoneData.id);
    }

    let zoneName: string;
    if (zoneData.name === undefined) {
      throw new Error('Zone file format exception: Zone name not present.');
    } else {
      zoneName = String(zoneData.name);
    }

    let zoneDescription = '';
    if (zoneData.description !== undefined) {
      zoneDescription = String(zoneData.description);
    }

    ZoneManager.activeZone = new Zone(zoneId, zoneName, zoneDescription);
    ZoneManager.activeZone.initialize(zoneData);
    ZoneManager.activeZone.onActivated();
    ZoneManager.activeZone.load();
  }
}
