import { getVitestAliases } from '@bedrock-apis/va-loader/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./**/*.test.ts'],
      alias: getVitestAliases(),
      setupFiles: ['./virtual-apis/load.ts'],
   },
});
