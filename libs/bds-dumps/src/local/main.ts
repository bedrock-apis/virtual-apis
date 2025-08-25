import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { chmod, mkdir, rename } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
   CACHE_DUMP_DIR,
   CACHE_OUTPUT_DIR,
   DUMP_CACHE_ZIP,
   EXPECTED_SOURCE,
   removeBdsTestConfig,
   writeBdsTestConfig,
} from './constants';
import { prepareBdsAndCacheFolders, unzip } from './make-ready';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

function run() {
   const start = Date.now();

   const child = spawn(EXPECTED_SOURCE, [], {
      // 'Editor=true'
      timeout: 60_000 * 3, //3mins in total
      detached: false,
      cwd: dirname(EXPECTED_SOURCE),
   });

   setTimeout(() => {
      if (!child.killed) {
         console.error('Fatal Timeout: process keep running, leak');
         process.exit(-1);
      }
   }, 60_000 * 5).unref(); //hard limit - 5mins

   return {
      child,
      promise: new Promise<void>((resolve, reject) => {
         let exited = false;
         const exit = () => {
            if (exited) return;
            exited = true;
            if (!child.killed) child.kill();
            child.unref();
            console.log(`🎉 BDS run done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
            resolve();
         };
         child.stdout.pipe(process.stdout);
         child.stderr.pipe(process.stderr);
         child.stdout.on('data', chunk => {
            if (chunk.toString().trim() === 'Quit correctly') exit();
         });
         child.on('error', reject);
         child.on('exit', code => {
            if (code !== 0) return reject(new Error('BDS exited with exit code ' + code));
            exit();
         });
      }),
   };
}

export async function main() {
   const { platform } = process;
   const gha = process.env.GITHUB_ACTION;
   const noBds = process.env.NO_BDS;
   if (!noBds && (platform === 'win32' || (platform === 'linux' && !gha))) {
      await mainSupported();
   } else {
      await mainUnsupported();
   }
}

async function mainUnsupported() {
   const stream = ReadableStream.from(createReadStream(DUMP_CACHE_ZIP).iterator());
   await unzip(stream, CACHE_OUTPUT_DIR);
   await mkdir(CACHE_DUMP_DIR, { recursive: true });
   await rename(join(CACHE_OUTPUT_DIR, 'docs'), join(CACHE_DUMP_DIR, 'docs'));
}

async function mainSupported() {
   const start = Date.now();

   await prepareBdsAndCacheFolders();
   await setupScriptAPI();

   // This part should be also moved to separated method to avoid additional main.ts complexity, basically be more deterministic
   const server = new HTTPServer(() => {
      if (child.exitCode === null) child.stdin.write('stop\n');
      setTimeout(() => child.kill(), 5_000).unref();
      server.server.close();
   });
   server.server.unref();

   if (process.platform !== 'win32') await chmod(EXPECTED_SOURCE, 0o755);

   await writeBdsTestConfig();
   await run().promise;
   await removeBdsTestConfig();

   const { child, promise } = run();

   await promise;

   console.log(`✅ BDS dump finished in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}
