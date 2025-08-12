import { spawn } from 'node:child_process';
import { chmod } from 'node:fs/promises';
import { dirname } from 'node:path';
import { exit, platform, stdout } from 'node:process';
import { EXPECTED_SOURCE } from './constants';
import { makeReady } from './make-ready';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

await makeReady();
await setupScriptAPI();

// This part should be also moved to separated method to avoid additional main.ts complexity, basically be more deterministic
const server = new HTTPServer(() => {
   if (child.exitCode === null) child.stdin.write('stop\n');
   setTimeout(() => child.kill(), 5_000).unref();
   server.server.close();
});
server.server.unref();
if (platform !== 'win32') {
   await chmod(EXPECTED_SOURCE, 0o755);
}
const child = spawn(EXPECTED_SOURCE, ['Editor=true'], {
   timeout: 60_000 * 3, //3mins in total
   detached: false,
   cwd: dirname(EXPECTED_SOURCE),
});
child.on('exit', () => console.log('END'));
setTimeout(() => {
   console.error('Fatal Timeout: process keep running, leak');
   exit(-1);
}, 60_000 * 5).unref(); //hard limit - 5mins
child.stdout.pipe(stdout);
