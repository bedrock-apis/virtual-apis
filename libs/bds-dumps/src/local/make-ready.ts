import { fetchJson } from '@bedrock-apis/common';
import { createReadStream, createWriteStream, existsSync, rmSync } from 'node:fs';
import { appendFile, mkdir, readdir, rm } from 'node:fs/promises';
import path, { dirname, resolve } from 'node:path';
import { env, platform } from 'node:process';
import { Readable } from 'node:stream';
import { UnzipStreamConsumer } from 'unzip-web-stream';
import { CACHE_BDS, CACHE_BDS_DOWNLOAD, CACHE_BDS_EXE_PATH, CACHE_DUMP_OUTPUT } from './constants';

export async function unzip(stream: ReadableStream, basePath: string) {
   const promises: Promise<void>[] = [];

   let filesExtracted = 0;
   let lastUpdate = performance.now();
   const startTime = lastUpdate;
   console.log('\n📦\tUnzipping to', basePath);
   await stream.pipeTo(
      new UnzipStreamConsumer({
         async onFile(report, readable) {
            const path = resolve(basePath, report.path);
            const dir = dirname(path);
            filesExtracted++;
            if (!existsSync(dir)) {
               await mkdir(dir, { recursive: true });
            }
            if (lastUpdate + 200 < performance.now()) {
               lastUpdate = performance.now();
               console.log(
                  `📦\t${path} \tTotal Files: ${filesExtracted}  Time: ${((lastUpdate - startTime) / 1000).toFixed(1)} \x1b[A`,
               );
            }
            promises.push(
               new Promise(res => Readable.fromWeb(readable).pipe(createWriteStream(path)).on('finish', res)),
            );
         },
      }),
   );
   await Promise.all(promises);

   console.log(
      `\n📦\tExtracting done . . .\t->\tTotal Files: ${filesExtracted}  Time: ${((lastUpdate - startTime) / 1000).toFixed(1)} \x1b[A`,
   );
}

export async function prepareBdsAndCacheFolders(): Promise<void> {
   if (env.REMOVE_CACHE) {
      if (existsSync(CACHE_BDS)) await rm(CACHE_BDS, { recursive: true, force: true });
   }
   if (existsSync(CACHE_DUMP_OUTPUT)) await rm(CACHE_DUMP_OUTPUT, { recursive: true, force: true });

   // Ensure
   if (!existsSync(CACHE_BDS_DOWNLOAD)) await mkdir(CACHE_BDS_DOWNLOAD, { recursive: true });
   if (!existsSync(CACHE_BDS)) await mkdir(CACHE_BDS, { recursive: true });
   else if (existsSync(CACHE_BDS_EXE_PATH)) return void console.log('⌚\tCache found . . .');

   await unzip(await getSource(), CACHE_BDS);
   await appendFile(path.join(CACHE_BDS, 'server.properties'), '\n\nemit-server-telemetry=true\n');
   console.log('📌\tSuccessfully installed . . .');
}

export async function getSource(): Promise<ReadableStream> {
   if (env.USE_CACHE) {
      const readable = await getCachedBinary();
      if (readable) return readable;
   }

   const latest = await fetchJson<{ linux: { preview: string }; windows: { preview: string } }>(
      'https://raw.githubusercontent.com/Bedrock-OSS/BDS-Versions/main/versions.json',
   );
   if (!latest) {
      const readable = await getCachedBinary();
      if (readable) return readable;
      throw new ReferenceError('No source available, no cache, no internet');
   }
   const version = platform === 'win32' ? latest.windows.preview : latest.linux.preview;

   const filename = `bedrock-server-${version}.zip`;
   const url = `https://www.minecraft.net/bedrockdedicatedserver/bin-${platform === 'win32' ? 'win' : 'linux'}-preview/${filename}`;

   const response = await fetch(url).catch(_ => null);
   if (!response) throw new ReferenceError('Something went wrong while requesting url: ' + url);
   if (!response.ok) throw new ReferenceError('Fetch failed, url:  ' + url);

   console.log('🚀\tDownloading Started . . .');

   const readable = response.body;
   if (!readable) throw new ReferenceError('No content, url:  ' + url);

   const [unzip, writeToFile] = readable.tee();
   const file = resolve(CACHE_BDS_DOWNLOAD, filename);
   Readable.fromWeb(writeToFile)
      .pipe(createWriteStream(file, { start: 0 }))
      .on('error', () => {
         if (existsSync(file)) rmSync(file);
      });

   return unzip;
}
export async function getCachedBinary(): Promise<ReadableStream | null> {
   for (const data of await readdir(CACHE_BDS_DOWNLOAD, { withFileTypes: true })) {
      if (!data.isFile()) continue;
      if (!data.name.endsWith('.zip')) continue;

      const path = resolve(CACHE_BDS_DOWNLOAD, data.name);
      console.log(`✅\tCache file found: ${data.name}`);
      return ReadableStream.from(createReadStream(path).iterator());
   }
   return null;
}
