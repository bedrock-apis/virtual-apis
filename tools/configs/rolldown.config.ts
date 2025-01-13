import type { ConfigExport, ExternalOption, RolldownOptions } from "rolldown";
import { ReadJson } from "../utils";
//import { ReadJson } from "../../src/utils";
//import * as pg from "../../package.json"



// don't use these!
// import build-ins only with this prefix "node:..."
// import { builtinModules } from "node:module"

const pg = await ReadJson<typeof import("../../package.json")>("package.json");
const external: ExternalOption = [
    /^node:/,
    /^@/,
    ...Object.keys(pg?.devDependencies ?? {})
];
class ExportOption implements RolldownOptions {
    public readonly output?: RolldownOptions["output"];
    public readonly external?: ExternalOption | undefined = external;
    public readonly platform?: "node" | "browser" | "neutral" | undefined = "node";
    public constructor(public readonly input: string | Array<string>, output: string = "./dist", sourcemap = true) {
        this.output = { sourcemap };
        if (Array.isArray(input)) this.output.dir = output;
        else this.output.file = output;
    }
}

export default [
    new ExportOption("./tools/configs/rolldown.config.ts", "./tools/configs/rolldown.config.js", false),
    new ExportOption("./tools/linter/config.ts", "./eslint.config.js", false),
    new ExportOption("./tools/build/index.ts", "./dist/build/index.js", false)
] satisfies ConfigExport;
