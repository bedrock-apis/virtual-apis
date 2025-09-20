import { system, Vector3, world } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';

type Reporter<T extends object = object> = () => Promise<T>;

const dumpReporters: Record<string, Reporter>[] = [];

export function registerScriptApiDumpReporters<T extends Record<string, object>>(reporters: {
   [K in keyof T]: Reporter<T[K]>;
}) {
   dumpReporters.push(reporters);
}

export async function runThread<T>(iterator: Iterable<void, T>): Promise<T> {
   return new Promise<T>((r, j) => system.runJob(localExecutor<T>(iterator, r, j)));
}
function* localExecutor<T>(
   iterator: Iterable<void, T>,
   resolve: (any: T) => void,
   reject: (er: unknown) => void,
): Generator<void> {
   try {
      const results = yield* iterator;
      resolve(results);
   } catch (error) {
      reject(error);
   }
}

system.beforeEvents.startup.subscribe(() => system.run(main));

async function main() {
   try {
      await report('hello_world.json', { hello: true });

      for (const reporters of dumpReporters) {
         for (const [id, reporter] of Object.entries(reporters)) {
            await report(`${id}.json`, await reporter());
         }
      }
   } catch (e) {
      console.error('main failure', e);
   } finally {
      await exit();
   }
}

async function report(name: string, data: unknown) {
   const request = new HttpRequest('http://localhost:29132/report/' + name);
   request.setMethod(HttpRequestMethod.Post);
   request.setBody(JSON.stringify(data));
   await http.request(request);
}
async function exit() {
   const request = new HttpRequest('http://localhost:29132/exit/');
   request.setMethod(HttpRequestMethod.Post);
   request.setBody(JSON.stringify({}));
   await http.request(request);
}

export async function loadChunk(location: Vector3, tickingareaName: string) {
   const dimension = world.getDimension('overworld');
   dimension.runCommand(`tickingarea add circle ${location.x} ${location.y} ${location.z} 4 ${tickingareaName}`);

   let runs = 0;
   let block;
   do {
      runs++;
      if (runs >= 100) throw new TypeError('Loading took too long');

      try {
         dimension.setBlockType(location, 'minecraft:bedrock');
         block = dimension.getBlock(location);
      } catch {
         /* empty */
      }
      if (!block?.isValid) await system.waitTicks(10);
   } while (!block?.isValid);

   return block;
}
