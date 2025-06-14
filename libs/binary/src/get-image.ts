import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { IndexedCollector } from '../../va-image-generator/src/binary/indexed-collector';
import { CurrentBinaryImageSerializer } from './image-formats';
import { ImageModuleData, ModuleMetadata } from './types';

// TODO Rewrite to be static class BinaryImageLoader

const cachePath = path.join(url.fileURLToPath(path.dirname(import.meta.url)), 'images');

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

export async function getImage(mcVersion: string): Promise<Uint8Array<ArrayBufferLike>> {
   try {
      const installed = require.resolve('@bedrock-apis/va-images');
      return new Uint8Array(await fs.readFile(installed));
   } catch (e) {
      if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) throw e;
   }

   return getCachedImage(mcVersion) ?? downloadImage(mcVersion);
}

const PARSED_IMAGES = new Map<string, PreparedImage>();

export interface PreparedImage {
   stringCollector: IndexedCollector<string>;
   typesCollector: IndexedCollector<{ name: number }>;
   modules: { metadata: Required<ModuleMetadata>; read: () => Promise<ImageModuleData> }[];
}

export async function getParsedImage(mcVersion: string | 'latest'): Promise<PreparedImage> {
   const cached = PARSED_IMAGES.get(mcVersion);
   if (cached) return cached;

   // @ts-expect-error Implement pls
   const parsed = CurrentBinaryImageSerializer.ReadAllModules(await getImage(mcVersion)) as PreparedImage;
   PARSED_IMAGES.set(mcVersion, parsed);
   return parsed;
}
