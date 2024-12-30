// @ts-check
import fs from 'node:fs';
import module from 'node:module';
import path from 'node:path';
import { defineConfig } from 'rolldown';

fs.rmSync('dist', { force: true, recursive: true });

/** @type {import('./package.json')} */
const PACKAGE_JSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const DEPENDENCIES = Object.keys(PACKAGE_JSON.devDependencies);
const PLUGINS = fs.readdirSync('src/plugins', { withFileTypes: true }).filter(e => e.isFile());
const EXTERNAL = [...module.builtinModules, /node/, ...DEPENDENCIES];

export default defineConfig(
   [
      {
         input: './src/package-builder/index.ts',
         output: { file: './dist/package-builder.js' },
      },
      {
         input: [
            './src/api-builder/index.ts',
            './src/loader/node/hooks.ts',
            './src/loader/node/loader.ts',
            './src/loader/vitest.ts',
            ...PLUGINS.map(e => `./src/plugins/${e.name}`),
         ],
         output: { dir: './dist/' },
      },
   ].map(e => ({ external: EXTERNAL, ...e })),
);

PACKAGE_JSON.exports = Object.fromEntries([
   ['.', { default: './dist/index.js', types: './dist/src/api-builder/index.d.ts' }],
   ['./package.json', './package.json'],
   ['./modules/*', './modules/*'],
   ['./loader', './dist/loader.js'],
   ['./vitest', { default: './dist/vitest.js', types: './dist/src/loader/vitest.d.ts' }],
   ...PLUGINS.map(e => [`./plugins/${path.parse(e.name).name}`, `./dist/${path.parse(e.name).name}.js`]),
]);

fs.writeFileSync('./package.json', JSON.stringify(PACKAGE_JSON, null, 3).replaceAll('\n', '\r\n'));
