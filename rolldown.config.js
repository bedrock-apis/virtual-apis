import { readFile } from "node:fs/promises";

//#region src/utils/system-io.ts
async function ReadJson(file) {
    try {
        return JSON.parse((await readFile(file)).toString());
    } catch (error) {
        return null;
    }
}

//#endregion
//#region tools/configs/rolldown.config.ts
const pg = await ReadJson("package.json");
const external = [
    /^node:/,
    /^@/,
    ...Object.keys(pg?.devDependencies ?? {})
];
var ExportOption = class {
    output;
    external = external;
    constructor(input, output = "./dist", sourcemap = false) {
        this.input = input;
        this.output = { sourcemap: false };
        if (Array.isArray(input)) this.output.dir = output;
        else this.output.file = output;
    }
};
var rolldown_config_default = [new ExportOption("./tools/configs/rolldown.config.ts", "./tools/configs/rolldown.config.js"), new ExportOption("./tools/linter/config.ts", "./eslint.config.js")];

//#endregion
export { rolldown_config_default as default };