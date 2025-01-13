import type { ConfigExport, ExternalOption, RolldownOptions } from 'rolldown';
import { ReadJson } from '../utils';
//import { ReadJson } from "../../src/utils";
//import * as pg from "../../package.json"

// don't use these!
// import build-ins only with this prefix "node:..."
// import { builtinModules } from "node:module"

const pg = await ReadJson<typeof import('package.json')>('package.json');
const external: ExternalOption = [
    /^node:/,
    /^@/,
    ///^[\w@][^:]/, //Official regex used by rolldown team to mark extern any not relative paths
    ...Object.keys(pg?.devDependencies ?? {}),
];
class ExportOption implements RolldownOptions {
    public readonly output?: RolldownOptions['output'];
    public readonly external?: ExternalOption | undefined = external;
    public readonly platform?: 'node' | 'browser' | 'neutral' | undefined = 'node';
    public constructor(
        public readonly input: $PROJECT_FILE_PATH | Array<$PROJECT_FILE_PATH>,
        output: string = './dist',
        sourcemap = true,
    ) {
        this.output = { sourcemap };
        if (Array.isArray(input)) this.output.dir = output;
        else this.output.file = output;
    }
    resolve?:
        | {
            alias?: Record<string, string[] | string>;
            aliasFields?: string[][];
            conditionNames?: string[];
            extensionAlias?: Record<string, string[]>;
            exportsFields?: string[][];
            extensions?: string[];
            mainFields?: string[];
            mainFiles?: string[];
            modules?: string[];
            symlinks?: boolean;
            tsconfigFilename?: string;
        }
        | undefined = {
            "tsconfigFilename": "tools/configs/tsconfig.json" satisfies $PROJECT_FILE_PATH
        };
}

export default [
    //new ExportOption("./tools/configs/rolldown.config.ts", "./tools/configs/rolldown.config.js", false),
    new ExportOption('tools/linter/config.ts', 'eslint.config.js' satisfies $PROJECT_FILE_PATH, false),
    new ExportOption('tools/build/pre/index.ts', './dist/build/pre.js', false),
] satisfies ConfigExport;
