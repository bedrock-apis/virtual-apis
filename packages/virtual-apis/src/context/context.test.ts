import { describe, expect, it } from 'vitest';
import { Context } from './context';

describe('Context', () => {
   it('should resolve minecraft version from module version', () => {
      const cases = [
         ['2.1.0-beta.1.21.80-stable', '1.21.80'],
         ['2.2.0-beta.1.21.100-preview.20', '1.21.100'],
         ['2.1.0-rc.1.21.100-preview.20', '1.21.100'],
         ['1.15.0-beta.1.21.30-preview.22', '1.21.30'],
         ['1.14.0-beta.1.21.20-stable', '1.21.20'],
         ['1.13.0', 'latest'],
         ['1.4.0-beta.1.20.10-stable', '1.20.10'],

         ['1.14.0-beta.1.21.20', '1.21.20'],
         ['-beta.1.21.20', '1.21.20'],
      ] as const;

      for (const [t, e] of cases) {
         expect(Context.ResolveMinecraftVersionFromModuleVersion(t)).toBe(e);
      }
   });
});
