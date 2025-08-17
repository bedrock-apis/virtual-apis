import { rm, writeFile } from 'node:fs/promises';
import path, { resolve } from 'node:path';
import { platform } from 'node:process';

export const CACHE_EXECUTABLE_DIR = resolve(import.meta.dirname, './cache');
export const CACHE_DUMP_DIR = resolve(import.meta.dirname, './cache-data');
export const CACHE_OUTPUT_DIR = resolve(import.meta.dirname, './cache-output');
export const SOURCE_DIR = resolve(import.meta.dirname, '../src/');
export const EXPECTED_SOURCE = resolve(CACHE_DUMP_DIR, platform === 'win32' ? 'bedrock_server.exe' : 'bedrock_server');
const FILE_CONTENT_BDS_TEST_CONFIG = JSON.stringify({ generate_documentation: true });
const FILE_NAME_BDS_TEST_CONFIG = 'test_config.json';
export function writeBdsTestConfig() {
   return writeFile(path.join(CACHE_DUMP_DIR, FILE_NAME_BDS_TEST_CONFIG), FILE_CONTENT_BDS_TEST_CONFIG);
}
export function removeBdsTestConfig() {
   return rm(path.join(CACHE_DUMP_DIR, FILE_NAME_BDS_TEST_CONFIG));
}
