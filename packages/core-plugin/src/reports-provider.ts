// TODO Somehow figure out how it would read reporst when bundled

import { readItemsReport, readLocalizationReport } from '@bedrock-apis/bds-dumps/api';

export const items = await readItemsReport();
export const localizationKeys = await readLocalizationReport();
