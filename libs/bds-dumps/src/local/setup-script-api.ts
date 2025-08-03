import { existsSync } from "node:fs";
import { appendFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "rolldown";
import { CACHE_DUMP_DIR, SOURCE_DIR } from "./constants";

export async function setupScriptAPI(): Promise<void>{
    let temporal = resolve(CACHE_DUMP_DIR, "./behavior_packs/editor/scripts/_temporal.js");

    const editorFile = resolve(CACHE_DUMP_DIR, "./behavior_packs/editor/scripts/Main.js");
    if(!existsSync(editorFile))
        throw new ReferenceError("Corrupted installation, please reinstall bds and make sure editor file exists! file: " + editorFile);

    if(existsSync(temporal)) await writeFile(editorFile, await readFile(temporal));
    else await writeFile(temporal, await readFile(editorFile));


    const addonEntry = resolve(SOURCE_DIR, "./client/main.ts");
    if(!existsSync(addonEntry))
        throw new ReferenceError("Failed to found addon entry");
    
    const output = await build({input:addonEntry});

    await appendFile(editorFile, "\r\n" + output.output[0].code);

    console.log('⚙️\t Script API injected . . .');
}