import type { ConfigExport, ExternalOption, RolldownOptions } from 'rolldown';
import { readJson } from './tools/utils';
//import { ReadJson } from "../../src/utils";
//import * as pg from "../../package.json"

// don't use these!
// import build-ins only with this prefix "node:..."
// import { builtinModules } from "node:module"

const pg = await readJson<typeof import('package.json')>('package.json');
const external: ExternalOption = [
    /^node:/,
    /^@/,
    ...Object.keys(pg?.devDependencies ?? {}),
    ...Object.keys(pg?.dependencies ?? {})
];
class ExportOption implements RolldownOptions {
    public readonly output?: RolldownOptions['output'];
    public readonly external?: ExternalOption | undefined = external;
    public readonly platform?: 'node' | 'browser' | 'neutral' | undefined = 'node';
    public constructor(
        public readonly input: ProjectFilePath | Array<ProjectFilePath>,
        output: string = 'dist',
        sourcemap = true,
    ) {
        this.output = { sourcemap };
        if (Array.isArray(input)) this.output.dir = output;
        else this.output.file = output;
    }
    public readonly resolve: RolldownOptions["resolve"] = {
        "tsconfigFilename": "tsconfig.json" satisfies ProjectFilePath
    };
}

export default [
    //new ExportOption("./tools/configs/rolldown.config.ts", "./tools/configs/rolldown.config.js", false),
    //new ExportOption('tools/linter/config.ts', 'eslint.config.js' satisfies $PROJECT_FILE_PATH, false),
    new ExportOption('tools/build/pre/index.ts', './dist/build/pre.js', false),
    new ExportOption('tools/build/packages/index.ts', 'dist/build/pack.js', false),
    new ExportOption('tools/build/todo/index.ts', 'dist/build/todos.js', false),
    new ExportOption('src/virtual-apis/index.ts', 'dist/build/index.js', false)
] satisfies ConfigExport;
