import { DumpProviderScriptApi } from '@bedrock-apis/va-bds-dumps/api';
import { JsonMarshaller } from '@bedrock-apis/va-binary';
import { resolve } from 'node:path';
import { TestReport } from '../types';

export type TestsReport = { tests: TestReport.Run };

export const testsResultProvider = new DumpProviderScriptApi<TestsReport>(
   'tests',
   import.meta.dirname,
   ['tests'],
   resolve(import.meta.dirname, './bds.js'),
   new JsonMarshaller(),
);
