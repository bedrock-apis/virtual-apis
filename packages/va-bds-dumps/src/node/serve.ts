import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer, Server } from 'node:http';
import { dirname, resolve } from 'node:path';
import { CACHE_DUMP_OUTPUT } from './constants';

export class HTTPServer {
   public readonly server: Server;
   public constructor(public readonly onStop: () => void) {
      this.server = createServer(async (req, resp) => {
         const response = new Response(ReadableStream.from(req.iterator()), {
            headers: req.headers as unknown as Headers,
         });
         const realResponse = await this.handle(response, req.url ?? '/');
         resp.statusCode = realResponse.status;
         resp.statusMessage = realResponse.statusText;
         resp.writeHead(
            realResponse.status,
            realResponse.statusText,
            Object.fromEntries(realResponse.headers.entries()),
         );
         const body = realResponse.body;
         if (!body) return void resp.end();
         for await (const chunk of body) req.push(chunk);
         resp.end();
      });
      // Same Port
      this.server.listen(29132);
   }
   public async handle(response: Response, url: string): Promise<Response> {
      console.log(url);
      const mainSwitch: string = url.match(/\/([^/]+)\//)?.[1] ?? '';
      console.log(url, 'switch: ' + mainSwitch);
      switch (mainSwitch) {
         case 'report': {
            const filePath = resolve(CACHE_DUMP_OUTPUT, '.' + url);
            const dirName = dirname(filePath);
            if (!existsSync(dirName)) await mkdir(dirName, { recursive: true });
            await writeFile(filePath, await response.text());
            break;
         }
         case 'exit':
            console.log('Exited');
            this.onStop();
            break;
         default:
            console.log(await response.text());
            return Response.json({ ok: false }, { status: 400 });
      }

      return Response.json({ ok: true });
   }
}
