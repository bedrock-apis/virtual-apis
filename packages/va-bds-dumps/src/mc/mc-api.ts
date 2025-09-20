import { system } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';

const dumpReporters: Record<string, () => Promise<object>>[] = [];

export function registerScriptApiDumpReporters<T extends Record<string, object>>(reporters: {
   [K in keyof T]: () => Promise<T[K]>;
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
