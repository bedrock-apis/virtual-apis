import { system } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';

system.beforeEvents.startup.subscribe(() =>
   system.run(async () => {
      for (let i = 0; i < 10; i++) {
         await report('hello', 'Hello World');
         await system.waitTicks(20);
      }
   }),
);

async function report(name: string, data: unknown) {
   const request = new HttpRequest('http://localhost:29132/reports/' + name);
   request.setMethod(HttpRequestMethod.Post);
   request.setBody(JSON.stringify(data));
   await http.request(request);
}
