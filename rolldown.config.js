// @ts-check
import fs from 'node:fs';
import module from 'node:module';
import { defineConfig } from 'rolldown';
import { DIST, ROOT, SRC } from './directories.js';

fs.rmSync('dist', { force: true, recursive: true });

/** @type {import('./package.json')} */
const PACKAGE_JSON = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const DEPENDENCIES = Object.keys(PACKAGE_JSON.devDependencies).concat(Object.keys(PACKAGE_JSON.dependencies));
const PLUGINS = Object.entries(SRC.plugins);
const EXTERNAL = [...module.builtinModules, /node/, ...DEPENDENCIES];

export default defineConfig(
   [
      {
         input: SRC.package_builder.index_ts,
         output: { file: DIST.package_builder_js },
      },
      {
         input: [
            SRC.api_builder.index_ts,
            SRC.loader.node.hooks_ts,
            SRC.loader.node.loader_ts,
            SRC.loader.vitest_ts,
            ...PLUGINS.map(e => e[1]),
         ],
         output: { dir: './dist/' },
      },
   ].map(e => ({ external: EXTERNAL, ...e })),
);

// @ts-expect-error
PACKAGE_JSON.exports = Object.fromEntries([
   ['.', { default: DIST.index_js, types: DIST.src.api_builder.index_d_ts }],
   ['./package.json', ROOT.package],
   ['./modules/*', './modules/*'],
   ['./plugins/*', './dist/plugins/*.js'],
   ['./loader', DIST.loader],
   ['./eslint-plugin', ROOT.eslint_plugin_js],
   ['./vitest', { default: DIST.vitest_js, types: DIST.src.loader.vitest_d_ts }],
]);

fs.writeFileSync('./package.json', JSON.stringify(PACKAGE_JSON, null, 3).replaceAll('\n', '\r\n'));
fs.mkdirSync('./dist/plugins', { recursive: true });
await Promise.all(
   PLUGINS.map(e =>
      fs.promises.writeFile(
         `./dist/plugins/${e[0].replace('_ts', '.js').replaceAll('_', '-')}`,
         `export * from '../${e}'`,
      ),
   ),
);