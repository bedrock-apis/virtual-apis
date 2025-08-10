import { fetchJson } from '@bedrock-apis/common';
import { createReadStream, createWriteStream, existsSync, rmSync } from 'node:fs';
import { mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { env, platform } from 'node:process';
import { Readable } from 'node:stream';
import { UnzipStreamConsumer } from 'unzip-web-stream';
import { CACHE_DUMP_DIR, CACHE_EXECUTABLE_DIR, EXPECTED_SOURCE } from './constants';

export async function makeReady(): Promise<void> {
   if (env.REMOVE_CACHE) {
      if (existsSync(CACHE_DUMP_DIR)) await rm(CACHE_DUMP_DIR, { recursive: true, force: true });
   }

   // Ensure
   if (!existsSync(CACHE_EXECUTABLE_DIR)) await mkdir(CACHE_EXECUTABLE_DIR, { recursive: true });
   if (!existsSync(CACHE_DUMP_DIR)) await mkdir(CACHE_DUMP_DIR, { recursive: true });
   else if (existsSync(EXPECTED_SOURCE)) return void console.log('⌚\tCache found . . .');

   const promises: Promise<void>[] = [];

   let filesExtracted = 0;
   let lastUpdate = performance.now();
   const startTime = lastUpdate;
   await (
      await getSource()
   ).pipeTo(
      new UnzipStreamConsumer({
         async onFile(report, readable) {
            const path = resolve(CACHE_DUMP_DIR, report.path);
            const dir = dirname(path);
            filesExtracted++;
            if (!existsSync(dir)) {
               await mkdir(dir, { recursive: true });
            }
            if (lastUpdate + 200 < performance.now()) {
               lastUpdate = performance.now();
               console.log(
                  `📦\t...${path.slice(-25)} \tTotal Files: ${filesExtracted}  Time: ${((lastUpdate - startTime) / 1000).toFixed(1)} \x1b[A`,
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
      `\n📦\tExtracting done . . .    ->    \tTotal Files: ${filesExtracted}  Time: ${((lastUpdate - startTime) / 1000).toFixed(1)} \x1b[A`,
   );
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
   const file = resolve(CACHE_EXECUTABLE_DIR, filename);
   Readable.fromWeb(writeToFile)
      .pipe(createWriteStream(file, { start: 0 }))
      .on('error', () => {
         if (existsSync(file)) rmSync(file);
      });

   return unzip;
}
export async function getCachedBinary(): Promise<ReadableStream | null> {
   for (const data of await readdir(CACHE_EXECUTABLE_DIR, { withFileTypes: true })) {
      if (!data.isFile()) continue;
      if (!data.name.endsWith('.zip')) continue;

      const path = resolve(CACHE_EXECUTABLE_DIR, data.name);
      console.log(`✅\tCache file found: ${data.name}`);
      return ReadableStream.from(createReadStream(path).iterator());
   }
   return null;
}
