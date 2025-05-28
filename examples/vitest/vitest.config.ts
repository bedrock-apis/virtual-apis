import { Vitest } from '@bedrock-apis/va-loader';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./**/*.test.ts'],
      alias: Vitest.getVitestAliases(),
      setupFiles: ['./virtual-apis/load.ts'],
   },
});
