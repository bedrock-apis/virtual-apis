import { main } from './main';

main()
   .catch(e => {
      console.error(e);
      process.exit(-1);
   })
   .then(() => {
      process.exit(0);
   });
