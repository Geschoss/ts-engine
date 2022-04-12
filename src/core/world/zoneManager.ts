import { Shader } from '../gl/shaders/shader';
import { TestZone } from './testZone';
import { Zone } from './zone';

const globalID = -1;
const zones: Record<string, Zone> = {};
const zone: Zone | undefined = undefined;

export const ZoneManager = createZoneManager({
  zones,
  activeZone: zone,
  globalZoneID: globalID,
});

type ZoneManagerOptions = {
  zones: Record<string, Zone>;
  globalZoneID: number;
  activeZone?: Zone;
};

function createZoneManager({
  zones,
  globalZoneID,
  activeZone,
}: ZoneManagerOptions) {
  const nextZoneID = () => ++globalZoneID;

  return {
    // test
    createTestZone() {
      let zone = new TestZone(nextZoneID(), 'testZone', 'A simple test zone');
      zones[zone.id] = zone;
      return zone.id;
    },
    createZone(name: string, description: string) {
      let zone = new Zone(nextZoneID(), name, description);
      zones[zone.id] = zone;
      return zone.id;
    },
    changeZone(id: number) {
      if (activeZone !== undefined) {
        activeZone.onDeactivated();
        activeZone.unload();
      }
      let zone = zones[id];
      if (zone) {
        activeZone = zone;
        activeZone.onActivated();
        activeZone.load();
      }
    },
    update(time: number) {
      if (activeZone !== undefined) {
        activeZone.update(time);
      }
    },
    render(shader: Shader) {
      if (activeZone !== undefined) {
        activeZone.render(shader);
      }
    },
  };
}
