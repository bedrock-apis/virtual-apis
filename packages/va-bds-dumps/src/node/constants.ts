import { rm, writeFile } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { platform } from 'node:process';

export const CACHE_BDS_DOWNLOAD = resolve(import.meta.dirname, './cache-bds-download');
export const CACHE_BDS = resolve(import.meta.dirname, './cache-bds');
export const CACHE_DUMP_OUTPUT = resolve(import.meta.dirname, './dump-output');
export const CACHE_DUMP_OUTPUT_JS_MODULES = path.join(CACHE_DUMP_OUTPUT, 'js-modules');
export const CACHE_DUMP_OUTPUT_ZIP = resolve(import.meta.dirname, '../dump-output.zip');
export const SOURCE_DIR = resolve(import.meta.dirname, '../src/');
export const CACHE_BDS_EXE_PATH = resolve(CACHE_BDS, platform === 'win32' ? 'bedrock_server.exe' : 'bedrock_server');

const FILE_CONTENT_BDS_TEST_CONFIG = JSON.stringify({ generate_documentation: true });
const FILE_NAME_BDS_TEST_CONFIG = 'test_config.json';

export function writeBdsTestConfig() {
   return writeFile(path.join(CACHE_BDS, FILE_NAME_BDS_TEST_CONFIG), FILE_CONTENT_BDS_TEST_CONFIG);
}
export function removeBdsTestConfig() {
   return rm(path.join(CACHE_BDS, FILE_NAME_BDS_TEST_CONFIG));
}
