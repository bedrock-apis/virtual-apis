import { spawn } from 'node:child_process';
import { chmod } from 'node:fs/promises';
import { dirname } from 'node:path';
import { platform, stdout } from 'node:process';
import { EXPECTED_SOURCE } from './constants';
import { makeReady } from './make-ready';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

await makeReady();
await setupScriptAPI();
const server = new HTTPServer(() => {
   if (child.exitCode === null) child.stdin.write('stop\n');
   setTimeout(() => child.kill(), 5_000).unref();
});
server.server.unref();
if (platform !== 'win32') {
   await chmod(EXPECTED_SOURCE, 0o755);
}
const child = spawn(EXPECTED_SOURCE, ['Editor=true'], {
   timeout: 100_000,
   detached: false,
   cwd: dirname(EXPECTED_SOURCE),
});
child.on('exit', () => console.log('END'));
child.stdout.pipe(stdout);
