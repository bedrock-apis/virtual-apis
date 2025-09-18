import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BlocksDataReport, ItemsDataReport, LocalizationKeysReport, TestsReport } from '../shared';
import { CACHE_DUMP_OUTPUT, CACHE_DUMP_OUTPUT_JS_MODULES } from './constants';
import { dump } from './dump';
export * from '../shared';

async function readAndMaybeRunBds(file: string): Promise<object> {
   const filepath = path.join(CACHE_DUMP_OUTPUT, file);
   if (!existsSync(filepath)) await dump();

   if (!existsSync(filepath)) {
      throw new Error('No file generated at ' + file + ' even after bds dump');
   }

   return JSON.parse(await fs.readFile(filepath, 'utf-8'));
}

async function readReport(name: string) {
   return readAndMaybeRunBds(path.join('report', name));
}

export const readTestReport = readReport.bind(null, 'tests.json') as () => Promise<TestsReport>;
export const readItemsReport = readReport.bind(null, 'items.json') as () => Promise<ItemsDataReport>;
export const readLocalizationReport = readReport.bind(
   null,
   'localization.json',
) as () => Promise<LocalizationKeysReport>;
export const readBlocksReport = readReport.bind(null, 'blocks.json') as () => Promise<BlocksDataReport>;

// Dev mode only function. No need to be in provider
export async function getOrGenerateMetadataFilepaths(): Promise<[string, string]> {
   const metadata = path.join(CACHE_DUMP_OUTPUT, 'docs/script_modules');
   const jsModules = CACHE_DUMP_OUTPUT_JS_MODULES;
   if (!existsSync(metadata) || !existsSync(jsModules)) await dump();
   if (!existsSync(metadata)) throw new Error('Unable to get metadata at ' + metadata);

   return [metadata, jsModules];
}

// export class DumpProvider<T> {
//    public constructor(
//       public readonly id: string,
//       public readonly afterBdsDump: (bdsFolder: string, outputFolder: string) => void,
//       public readonly onExtract: (folder: string) => Promise<T>,
//       public readonly marshaller: { marshal(io: BinaryIO<T>): void },
//    ) {}

//    protected defaultImagePath = resolve(import.meta.url, 'image.gz');

//    public async write(output: string): Promise<void> {
//       // const image = marshal.marshal(writer(onExtract(output)))
//       // writeFile(image.gz, image)
//       return;
//    }

//    public async read(path = this.defaultImagePath): Promise<T> {
//       // return marshal.marshal(reader(readFile(path)))
//       return undefined as T;
//    }
// }

// new DumpProvider(
//    'modules',
//    async (bds, output) => {
//       // mv 'docs/script_modules' -> output/script_metadata
//       // mv behavior packs libraries -> output/js_modules
//    },
//    async output => {
//       // return MetadataToSerializable(provider(output/script_metadata, output/js_modules))
//       return 0;
//    },
//    {
//       marshal(io) {}, // image format
//    },
// );

// class DumpProviderScriptApi<T> extends DumpProvider<T> {
//    public constructor(id: string, scriptApiCodePath: string, marshaller: { marshal(io: BinaryIO<T>): void }) {
//       super(
//          id,
//          (bds, output) => {
//             // mv reports/id -> output/reports/id
//          },
//          async output => {
//             // return readFile(output/reports/id)
//             return 0 as T;
//          },
//          marshaller,
//       );
//    }
// }

// new DumpProviderScriptApi('tests', './test-run-mc.ts', {
//    marshal(io) {},
// });

// function bdsDumpSupported(needBds:string) {
//    if (installedBds !== needBds) installBds()
//    runBds(bdsFolder);
//    for (const provider of providers) {
//       provider.afterBdsRun(bdsFolder, outputFolder);
//    }
//    zipOutput()
//    for (const provider of providers) {
//       provider.write(outputFolder);
//    }
// }

// function bdsDumpUnsupported() {
//    unzipOutput()
//    for (const provider of providers) {
//       provider.write(outputFolder);
//    }
// }
