import * as mc from '@minecraft/server';
import { describe, expect, it } from 'vitest';

describe('scripts', () => {
   it('expects module', () => {
      expect(mc).toMatchInlineSnapshot(`
        {
          "CommandResult": [Function],
          "Dimension": [Function],
          "Entity": [Function],
          "MinecraftDimensionTypes": [Function],
          "Player": [Function],
          "System": [Function],
          "World": [Function],
          "system": System {},
          "world": World {},
        }
      `);
   });
});
