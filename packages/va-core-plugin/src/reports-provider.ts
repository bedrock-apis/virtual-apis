// TODO Somehow figure out how it would read reporst when bundled

import { readBlocksReport, readItemsReport, readLocalizationReport } from '@bedrock-apis/va-bds-dumps/api';

export const items = await readItemsReport();
export const localizationKeys = await readLocalizationReport();
export const blocks = await readBlocksReport();
