import { spawn } from 'node:child_process';
import { stdout } from 'node:process';
import { EXPECTED_SOURCE } from './constants';
import { makeReady } from './make-ready';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

await makeReady();
await setupScriptAPI();
const server = new HTTPServer();
server.server.unref();
const child = spawn(EXPECTED_SOURCE, ['Editor=true'], { timeout: 10_000, detached: false });
child.on('exit', () => console.log('END'));
child.stdout.pipe(stdout);
setTimeout(() => child.stdin.write('stop\n'), 100_000);
