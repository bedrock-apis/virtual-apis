import module from 'node:module';

// This module is loader and hook at the same time
module.register(import.meta.url, import.meta.url);