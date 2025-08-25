import { dump } from './dump';

dump()
   .catch(e => {
      console.error(e);
      process.exit(-1);
   })
   .then(() => {
      process.exit(0);
   });
