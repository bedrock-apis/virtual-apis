import { defineConfig } from 'vitest/config';

export default defineConfig({
   test: {
      include: ['./libs/**/*.test.ts', './packages/**/*.test.ts'],
      coverage: {
         provider: 'v8',
         reporter: ['html', 'json'],
         include: ['src'],
      },
   },
});
