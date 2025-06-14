import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { IndexedAccessor } from '../../va-image-generator/src/binary/indexed-collector';
import { CurrentBinaryImageSerializer } from './image-formats';
import { ImageModuleData, ModuleMetadata } from './types';

export class BinaryImageLoader {
   private static readonly CACHE_PATH = path.join(url.fileURLToPath(path.dirname(import.meta.url)), 'images');
   private static GetImageCachePath(version: string) {
      return path.join(this.CACHE_PATH, version);
   }

   private static async SetCachedImage(version: string, image: Uint8Array) {
      try {
         await fs.mkdir(this.CACHE_PATH, { recursive: true });
         // eslint-disable-next-line no-empty
      } catch {}

      const imagePath = this.GetImageCachePath(version);

      await fs.writeFile(imagePath, image);
   }

   private static async GetCachedImage(version: string) {
      return new Uint8Array(await fs.readFile(this.GetImageCachePath(version)));
   }

   private static async DownloadImage(version: string) {
      const image = new Uint8Array(await (await fetch('')).arrayBuffer()); // fetch from gh

      this.SetCachedImage(version, image);

      return image;
   }

   private static async GetImage(mcVersion: string): Promise<Uint8Array<ArrayBufferLike>> {
      try {
         const installed = require.resolve('@bedrock-apis/va-images');
         return new Uint8Array(await fs.readFile(installed));
      } catch (e) {
         if (!(e instanceof Error && 'code' in e && e.code === 'MODULE_NOT_FOUND')) throw e;
      }

      return this.GetCachedImage(mcVersion) ?? this.DownloadImage(mcVersion);
   }

   private static readonly PARSED_IMAGES = new Map<string, PreparedImage>();

   public static async GetParsedImage(mcVersion: string | 'latest'): Promise<PreparedImage> {
      const cached = this.PARSED_IMAGES.get(mcVersion);
      if (cached) return cached;

      // @ts-expect-error Need to implement
      const parsed = CurrentBinaryImageSerializer.SomehowRead(await this.GetImage(mcVersion)) as PreparedImage;
      this.PARSED_IMAGES.set(mcVersion, parsed);
      return parsed;
   }
}

export interface PreparedImage {
   stringSlice: IndexedAccessor<string>;
   typeSlice: IndexedAccessor<{ name: number }>;
   modules: { metadata: Required<ModuleMetadata>; read: () => Promise<ImageModuleData> }[];
}
