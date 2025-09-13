import { describe, expect, it } from 'vitest';
import { compareVersions } from './helper';

describe('helper', () => {
   it('should compare versions', () => {
      expect(compareVersions('1.3.0', '1.4.0')).toMatchInlineSnapshot(`-1`);
      expect(compareVersions('1.3.0', '1.4.0-beta')).toMatchInlineSnapshot(`-1`);
      expect(compareVersions('1.4.0', '1.4.0-beta')).toMatchInlineSnapshot(`-1`);
      expect(compareVersions('1.5.0', '1.4.0-beta')).toMatchInlineSnapshot(`1`);
      expect(compareVersions('1.5.0', '1.5.0')).toMatchInlineSnapshot(`0`);
      expect(compareVersions('1.15.0', '2.0.0')).toMatchInlineSnapshot(`-1`);
   });
});
