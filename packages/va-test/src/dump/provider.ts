import { DumpProviderScriptApi } from '@bedrock-apis/va-bds-dumps/api';
import { JsonMarshaller } from '@bedrock-apis/va-binary';
import { TestReport } from '../types';
import {resolve} from "node:path"

export type TestsReport = { tests: TestReport.Run };

export const testsResultProvider = new DumpProviderScriptApi<TestsReport>(
   'tests',
   ['tests'],
   resolve(import.meta.url, './bds.js'),
   new JsonMarshaller(),
);
