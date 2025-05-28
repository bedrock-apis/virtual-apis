import module from 'node:module';
module.register(import.meta.url, import.meta.url);

console.log(import.meta.url);