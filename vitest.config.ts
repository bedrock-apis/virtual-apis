import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./src/**/*.test.ts', './tools/**/*.test.ts'],
      coverage: {
         provider: 'istanbul',
         reporter: ['html', 'json'],
         include: ['src'],
      },
      setupFiles: ['vitest-setup.config.ts'],
   },
});
