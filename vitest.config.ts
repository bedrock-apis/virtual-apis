import { defineConfig } from 'vitest/config';
import { virtualApi } from './packages/va-loader/src/vitest-plugin/vitest';
import {CustomVAPlugin} from "./customPlugin.ts";

export default defineConfig({
   plugins:[virtualAPIs({corePlugins: [CustomVAPlugin]})]
   test: {
      include: ['./libs/**/*.test.ts', './packages/**/*.test.ts'],
      coverage: {
         provider: 'istanbul',
         reporter: ['html', 'json'],
         include: ['src'],
      },
   },
});
