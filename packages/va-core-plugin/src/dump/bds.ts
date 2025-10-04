import { registerScriptApiDumpReporters } from '@bedrock-apis/va-bds-dumps/mc-api';
import { blocksReport } from './extractors/blocks';
import { entitiesReport } from './extractors/entity';
import { itemsReport } from './extractors/items';
import { CorePluginVanillaDataReport } from './provider';

registerScriptApiDumpReporters<CorePluginVanillaDataReport>({
   entities: entitiesReport,
   blocks: blocksReport,
   items: itemsReport,
});
