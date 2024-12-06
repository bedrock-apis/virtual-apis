import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: './src/codegen/index.ts',
    external: ['typescript', /node:/g],
    output: {
      file: 'codegen.js',
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
