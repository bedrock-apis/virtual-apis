import { RunThreadAsync } from '@bedrock-apis/va-test';
import { system } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';
import { blockResolver } from './extractors/blocks';
import { itemStackResolver } from './extractors/items';
import { localizationKeysResolver } from './extractors/localization-keys';
import { testsResolver } from './extractors/tests';

system.beforeEvents.startup.subscribe(() => system.run(main));

async function main() {
   try {
      await report('hello_world.json', { hello: true });
      await report('tests.json', await testsResolver());
      await report('blocks.json', await runThread(blockResolver()));
      await report('items.json', await runThread(itemStackResolver()));
      await report('localization.json', await RunThreadAsync(localizationKeysResolver(), system.runJob.bind(system)));
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

async function runThread<T>(iterator: Iterable<void, T>): Promise<T> {
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
