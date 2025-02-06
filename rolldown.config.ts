import fs from 'fs/promises';
import path from 'path';
import type { ConfigExport, ExternalOption, OutputOptions, RolldownOptions } from 'rolldown';
import { readJson } from './tools/utils';

const packageJson = await readJson<typeof import('./package.json')>('package.json');
const external: ExternalOption = [
   /^node:/,
   /^@/,
   ...Object.keys(packageJson?.devDependencies ?? {}),
   ...Object.keys(packageJson?.dependencies ?? {}),
];

const packageExports: Record<string, { default: `./${string}`; types: `./${string}` } | string> = {
   './package.json': './package.json',
};
const pluginsPath = 'src/plugin/core' satisfies ProjectDirPath;
const plugins = (await fs.readdir(pluginsPath, { withFileTypes: true }))
   .filter(e => e.isFile())
   .map(e => ({
      source: path.join(pluginsPath, e.name).replaceAll('\\', '/') as ProjectFilePath,
      dist: path.parse(e.name).name + '.js',
   }));

class ExportOption implements RolldownOptions {
   public readonly output: OutputOptions;
   public readonly external?: ExternalOption | undefined = external;
   public readonly platform?: 'node' | 'browser' | 'neutral' | undefined = 'node';

   public constructor(public readonly input: ProjectFilePath | ProjectFilePath[]) {
      this.output = { sourcemap: true };
   }

   public toFile(file: string) {
      this.output.file = file;
      return this;
   }

   public toDirectory(directory: string) {
      this.output.dir = directory;
      return this;
   }

   public exports(name: string, types = true) {
      if (this.output.file && typeof this.input === 'string') {
         packageExports[name] = types
            ? {
                 default: `./${this.output.file}`,
                 types: `./dist/${this.input.replace(/.ts$/, '.d.ts')}`,
              }
            : `./${this.output.file}`;
      }
      return this;
   }

   public readonly resolve: RolldownOptions['resolve'] = {
      tsconfigFilename: 'tsconfig.json' satisfies ProjectFilePath,
   };
}

class ExportDirectoryOption extends ExportOption {
   public constructor(...options: ExportOption[]) {
      super(options.map(e => e.input).flat());
   }
}

export default [
   new ExportOption('tools/eslint/plugin.ts').toFile('dist/eslint/eslint-plugin.js').exports('./eslint-plugin'),
   new ExportDirectoryOption(
      new ExportOption('src/virtual-apis/index.ts').toFile('dist/api/index.js').exports('.'),
      ...plugins.map(plugin => new ExportOption(plugin.source).toFile(`dist/api/${plugin.dist}`)),
      new ExportOption('src/loader/vitest.ts').toFile('dist/api/vitest.js').exports('./vitest'),
      new ExportOption('src/loader/node/loader.ts').toFile('dist/api/loader.js').exports('./loader'),
      new ExportOption('src/loader/node/hooks.ts').toFile('dist/api/hooks.js'),
   ).toDirectory('dist/api'),
] satisfies ConfigExport;

await fs.mkdir('./dist/plugins', { recursive: true });
await fs.writeFile(
   'dist/plugins/all.js',
   `// This file is autogenerated by ${import.meta.filename}
import '../api/modules.js';

${plugins
   .filter(e => e.dist !== 'modules.js')
   .map(({ dist }) => `import './${dist}';`)
   .join('\r\n')}\r\n`,
);
await fs.mkdir('dist/src/plugin/core', { recursive: true });
await fs.writeFile('dist/src/plugin/core/all.d.ts', 'export {}');
await Promise.all(
   plugins
      .filter(e => e.dist !== 'modules.js')
      .map(({ dist }) => {
         const file = `'../api/${dist}'`;
         return fs.writeFile(
            path.join('dist/plugins', dist),
            `export * from ${file}\r\nimport m from ${file}\r\nexport default m`,
         );
      }),
);
packageExports['./plugins/*'] = {
   default: './dist/plugins/*.js',
   types: `./dist/${'src/plugin/core' satisfies ProjectDirPath}/*.d.ts`,
};
packageExports['./modules/*'] = './modules/*';

if (packageJson) {
   packageJson.exports = packageExports as unknown as (typeof packageJson)['exports'];

   await fs.writeFile('package.json', JSON.stringify(packageJson, null, 3).replaceAll('\n', '\r\n') + '\r\n');
}
