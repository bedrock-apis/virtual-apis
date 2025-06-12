import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const cachePath = path.join(url.fileURLToPath(import.meta.dirname), 'images');

function getImageCachePath(version: string) {
   return path.join(cachePath, version);
}

async function setCachedImage(version: string, image: Uint8Array) {
   try {
      await fs.mkdir(cachePath, { recursive: true });
      // eslint-disable-next-line no-empty
   } catch {}

   const imagePath = getImageCachePath(version);

   await fs.writeFile(imagePath, image);
}

async function getCachedImage(version: string) {
   return new Uint8Array(await fs.readFile(getImageCachePath(version)));
}

async function downloadImage(version: string) {
   const image = new Uint8Array(await (await fetch('')).arrayBuffer()); // fetch from gh

   setCachedImage(version, image);

   return image;
}

export async function getImage(mcVersion: string | 'latest'): Promise<Uint8Array<ArrayBufferLike>> {
   try {
      const installed = require.resolve('@bedrock-apis/va-images');
      return new Uint8Array(await fs.readFile(installed));
   } catch (e) {
      if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) throw e;
   }

   return getCachedImage(mcVersion) ?? downloadImage(mcVersion);
}
