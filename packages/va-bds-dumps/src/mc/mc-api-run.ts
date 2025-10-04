import { system } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';
import { dumpReporters } from './mc-api';

system.beforeEvents.startup.subscribe(() => system.run(main));

async function main() {
   try {
      await report('hello_world.json', { hello: true });

      for (const reporters of dumpReporters) {
         for (const [id, reporter] of Object.entries(reporters)) {
            const res = await reporter();
            console.log(id, 'result size', id, JSON.stringify(res).length);
            await report(`${id}.json`, res);
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
