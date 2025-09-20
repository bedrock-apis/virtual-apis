import { registerScriptApiDumpReporters } from '@bedrock-apis/va-bds-dumps/mc-api';
import { blocksReport } from './extractors/blocks';
import { itemsReport } from './extractors/items';
import { langReporter } from './extractors/localization-keys';
import { CorePluginVanillaDataReport } from './provider';

registerScriptApiDumpReporters<CorePluginVanillaDataReport>({
   localizationKeys: langReporter,
   blocks: blocksReport,
   items: itemsReport,
});
