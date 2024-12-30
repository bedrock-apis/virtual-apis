import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./src/**/*.test.ts'],
      coverage: {
         provider: 'istanbul',
         reporter: ['html', 'json'],
         include: ['src'],
      },
   },
});
