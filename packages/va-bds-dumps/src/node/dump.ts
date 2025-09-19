import AdmZip from 'adm-zip';
import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { chmod } from 'node:fs/promises';
import { dirname } from 'node:path';
import { DumpProvider } from './api';
import {
   CACHE_BDS,
   CACHE_BDS_EXE_PATH,
   CACHE_DUMP_OUTPUT,
   CACHE_DUMP_OUTPUT_ZIP,
   removeBdsTestConfig,
   writeBdsTestConfig,
} from './constants';
import { prepareBdsAndCacheFolders, unzip } from './prepare-bds';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

export async function dump(providers: DumpProvider[]) {
   const { platform } = process;
   const gha = process.env.GITHUB_ACTION;
   const noBds = process.env.NO_BDS ?? true; // enable by default for now cuz we publishing
   if (!noBds && (platform === 'win32' || (platform === 'linux' && !gha))) {
      await dumpSupported(providers);
   } else {
      await dumpUnsupported(providers);
   }
}

async function dumpUnsupported(providers: DumpProvider[]) {
   const stream = ReadableStream.from(createReadStream(CACHE_DUMP_OUTPUT_ZIP).iterator());
   await unzip(stream, CACHE_DUMP_OUTPUT);

   for (const provider of providers) {
      provider.writeImage(CACHE_DUMP_OUTPUT);
   }
}

async function dumpSupported(providers: DumpProvider[]) {
   const start = Date.now();

   await prepareBdsAndCacheFolders();
   await setupScriptAPI();

   await writeBdsTestConfig();
   if (process.platform !== 'win32') await chmod(CACHE_BDS_EXE_PATH, 0o755);
   await executeBds().promise;
   await removeBdsTestConfig();

   // This part should be also moved to separated method to avoid additional main.ts complexity, basically be more deterministic
   const server = new HTTPServer(() => {
      if (child.exitCode === null) child.stdin.write('stop\n');
      setTimeout(() => child.kill(), 5_000).unref();
      server.server.close();
   });
   server.server.unref();

   const { child, promise } = executeBds();
   await promise;

   for (const provider of providers) {
      await provider.afterBdsDump(CACHE_BDS, CACHE_DUMP_OUTPUT);
   }

   const zip = new AdmZip();
   await zip.addLocalFolderPromise(CACHE_DUMP_OUTPUT, {});
   await zip.writeZipPromise(CACHE_DUMP_OUTPUT_ZIP);

   console.log(`✅\tBDS dump finished in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}

function executeBds() {
   const start = Date.now();

   const child = spawn(CACHE_BDS_EXE_PATH, [], {
      // 'Editor=true'
      timeout: 60_000 * 3, //3mins in total
      detached: false,
      cwd: dirname(CACHE_BDS_EXE_PATH),
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
            console.log(`🎉\tBDS run done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
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
