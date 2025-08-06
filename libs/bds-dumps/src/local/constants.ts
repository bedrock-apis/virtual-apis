import { resolve } from 'node:path';
import { platform } from 'node:process';

export const CACHE_EXECUTABLE_DIR = resolve(import.meta.dirname, './cache');
export const CACHE_DUMP_DIR = resolve(import.meta.dirname, './cache-data');
export const SOURCE_DIR = resolve(import.meta.dirname, '../src/');
export const EXPECTED_SOURCE = resolve(CACHE_DUMP_DIR, platform === 'win32' ? 'bedrock_server.exe' : 'bedrock_server');
