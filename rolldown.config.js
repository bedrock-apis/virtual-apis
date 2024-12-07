import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: './src/package-builder/index.ts',
    external: ['typescript', /node:/g, 'prettier'],
    output: {
      file: 'build.js',
    },
  },
  {
    input: './src/api-builder/index.ts',
    external: ['typescript'],
    output: {
      file: 'api-builder.js',
    },
  },
]);
