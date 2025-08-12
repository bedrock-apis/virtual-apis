import { system } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod } from '@minecraft/server-net';

system.beforeEvents.startup.subscribe(() => system.run(main));

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

async function main() {
   await report('hello_world.json', { hello: true });
   await exit();
}
