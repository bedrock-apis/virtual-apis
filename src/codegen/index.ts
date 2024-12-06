import {exit} from "node:process";
import { mkdir, writeFile } from "node:fs/promises";
import {generateModule} from './codegen';
import { MetadataModuleDefinition } from "./ScriptModule";
import { existsSync } from "node:fs";

Main().then(exit, e=>{
    console.error(e);
    exit(-1);
});


async function Main(): Promise<number>{
    // Fetch Latest Metadata
    const response = await fetch(`https://raw.githubusercontent.com/Bedrock-APIs/bds-docs/${"preview"}/metadata/script_modules/@minecraft/server_1.1.0.json`);

    // Check for validity
    if(!response.ok){
        console.error("Failed to fetch metadata");
        return -1;
    }

    // JSON Parsed metadata
    const METADATA = (await response.json()) as MetadataModuleDefinition;

    // Execute Code Gen
    const [fakeAPIs, definitionAPIs] = generateModule(METADATA);

    const MODULE_SHORT_NAME = METADATA.name.split("/")[1]??null;

    if(!MODULE_SHORT_NAME) {
        console.error(`Failed to generate files for ${METADATA.name}, invalid module name`);
        return -1;
    }

    if(!existsSync("./bin")){
        await mkdir("./bin/");
    }

    await writeFile(`./bin/${MODULE_SHORT_NAME}.js`, fakeAPIs);
    await writeFile(`./bin/${MODULE_SHORT_NAME}.native.js`, definitionAPIs);
    
    // 0 Is success otherwise false
    return 0;
}