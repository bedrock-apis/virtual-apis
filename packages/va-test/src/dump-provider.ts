import { DumpProviderScriptApi } from '@bedrock-apis/va-bds-dumps/api';
import { JsonMarshaller } from '@bedrock-apis/va-binary';
import { TestReport } from './types';

export type TestsReport = { tests: TestReport.Run };

export const testsResultProvider = new DumpProviderScriptApi<TestsReport>(
   'tests',
   ['tests'],
   './test-run-mc.ts',
   new JsonMarshaller(),
);
