import { getVitestAliases } from '@bedrock-apis/virtual-apis/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      alias: getVitestAliases(),
      setupFiles: ['./virtual-apis/load.ts'],
   },
});
