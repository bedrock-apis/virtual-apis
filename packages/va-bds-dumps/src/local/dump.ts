import AdmZip from 'adm-zip';
import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { chmod, cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
   CACHE_BDS,
   CACHE_BDS_EXE_PATH,
   CACHE_DUMP_OUTPUT,
   CACHE_DUMP_OUTPUT_JS_MODULES,
   CACHE_DUMP_OUTPUT_ZIP,
   removeBdsTestConfig,
   writeBdsTestConfig,
} from './constants';
import { prepareBdsAndCacheFolders, unzip } from './prepare-bds';
import { HTTPServer } from './serve';
import { setupScriptAPI } from './setup-script-api';

export async function dump() {
   const { platform } = process;
   const gha = process.env.GITHUB_ACTION;
   const noBds = process.env.NO_BDS ?? true; // enable by default for now cuz we publishing
   if (!noBds && (platform === 'win32' || (platform === 'linux' && !gha))) {
      await dumpSupported();
   } else {
      await dumpUnsupported();
   }
}

async function dumpUnsupported() {
   const stream = ReadableStream.from(createReadStream(CACHE_DUMP_OUTPUT_ZIP).iterator());
   await unzip(stream, CACHE_DUMP_OUTPUT);
}

async function dumpSupported() {
   const start = Date.now();

   await prepareBdsAndCacheFolders();
   await setupScriptAPI();

   await writeBdsTestConfig();
   await executeBds().promise;
   await removeBdsTestConfig();

   // This part should be also moved to separated method to avoid additional main.ts complexity, basically be more deterministic
   const server = new HTTPServer(() => {
      if (child.exitCode === null) child.stdin.write('stop\n');
      setTimeout(() => child.kill(), 5_000).unref();
      server.server.close();
   });
   server.server.unref();

   if (process.platform !== 'win32') await chmod(CACHE_BDS_EXE_PATH, 0o755);

   const { child, promise } = executeBds();

   await promise;

   await rm(join(CACHE_DUMP_OUTPUT, 'docs'), { recursive: true, force: true }).catch(_ => null);
   await cp(join(CACHE_BDS, 'docs'), join(CACHE_DUMP_OUTPUT, 'docs'), { recursive: true });
   await rm(CACHE_DUMP_OUTPUT_JS_MODULES, { recursive: true, force: true }).catch(_ => null);

   await mkdir(CACHE_DUMP_OUTPUT_JS_MODULES);
   for (const folder of await readdir(join(CACHE_BDS, 'behavior_packs'), { withFileTypes: true })) {
      if (!folder.isDirectory()) continue;
      const name = folder.name.replace(/_library$/, '');
      if (name === folder.name) continue; //not a module

      //libs\va-bds-dumps\dist\cache-bds\behavior_packs\server_editor_library\scripts
      await cp(join(folder.parentPath, folder.name, 'scripts'), join(CACHE_DUMP_OUTPUT_JS_MODULES, name), {
         recursive: true,
      });
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
