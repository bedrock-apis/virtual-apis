import fs from 'node:fs/promises';
import module from 'node:module';
import path from 'node:path';
import { DIST, ROOT, SRC } from './directories.js';

await fs.rm(DIST.DIR, { force: true, recursive: true });

/** @type {import('./package.json')} */
const PACKAGE_JSON = JSON.parse(await fs.readFile(ROOT.package_json, 'utf-8'));
const DEPENDENCIES = Object.keys(PACKAGE_JSON.devDependencies).concat(Object.keys(PACKAGE_JSON.dependencies));
const EXTERNAL = [...module.builtinModules, /node/, ...DEPENDENCIES];

const PLUGINS = Object.entries(SRC.core_plugins)
   .filter(e => e[0] !== 'DIR')
   .map(([filename, path]) => ({
      filename: filename.replace(/_ts$/, '.js').replaceAll('_', '-'),
      path,
   }));

/** @type {import('rolldown').ConfigExport} */
const ENTRIES = [
   {
      input: SRC.package_builder.index_ts,
      output: { file: DIST.package_builder_js, sourcemap: true },
   },
   {
      input: [
         SRC.api_builder.index_ts,
         SRC.loader.node.hooks_ts,
         SRC.loader.node.loader_ts,
         SRC.loader.vitest_ts,
         ...PLUGINS.map(e => e.path),
      ],
      output: { dir: DIST.DIR, sourcemap: true },
   },
];

/** @type {import('rolldown').ConfigExport} */
const ENTRIES_WITH_EXTERNAL = ENTRIES.map(e => ({ external: EXTERNAL, ...e }));

export default ENTRIES_WITH_EXTERNAL;

await fs.mkdir(DIST.plugins.DIR, { recursive: true });
await Promise.all(
   PLUGINS.map(({ filename }) => {
      return fs.writeFile(path.join(DIST.plugins.DIR, filename), `export * from '../${filename}'`);
   }),
);

PACKAGE_JSON.exports = Object.fromEntries([
   ['.', { default: DIST.index_js, types: DIST.src.api_builder.index_d_ts }],
   ['./package.json', ROOT.package_json],
   ['./modules/*', ROOT.modules.DIR + '*'],
   ['./plugins/*', { default: DIST.plugins.DIR + '*.js', types: DIST.src.core_plugins.DIR + '*' }],
   ['./loader', DIST.loader_js],
   ['./eslint-plugin', ROOT.eslint_plugin_js],
   ['./vitest', { default: DIST.vitest_js, types: DIST.src.loader.vitest_d_ts }],
]);

await fs.writeFile(ROOT.package_json, JSON.stringify(PACKAGE_JSON, null, 3).replaceAll('\n', '\r\n'));
