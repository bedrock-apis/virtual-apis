import { virtualApi } from '@bedrock-apis/va-loader/vitest';
import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./**/*.test.ts'],
      setupFiles: ['./virtual-apis/load.ts'],
   },
   plugins: [virtualApi()],
});
