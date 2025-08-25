import { world } from '@minecraft/server';
import { TestSuite } from '../suite';

TestSuite.simple('events').test(() => world.afterEvents.buttonPush.subscribe(() => {}));
