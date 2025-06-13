import { SystemFileMetadataProvider } from '../metadata-provider';
import { main } from './index';

main(new SystemFileMetadataProvider('./bds-docs-stable/metadata/script_modules/')).then(
   r => (process.exitCode = r),
   e => {
      console.error(e);
      process.exit(-1);
   },
);
