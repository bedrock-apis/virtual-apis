import { createServer, Server } from 'node:http';

export class HTTPServer {
   public readonly server: Server;
   public constructor() {
      this.server = createServer(async (req, resp) => {
         console.log(req.url, req.headers);
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
      console.log(await response.json());
      if (url.match(/\/report\/[^/]/)) {
         console.log('File name: ' + url);
      }

      return Response.json({ ok: true });
   }
}
