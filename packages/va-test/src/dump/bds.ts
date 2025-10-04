import '../suites/all';

import { registerScriptApiDumpReporters } from '@bedrock-apis/va-bds-dumps/mc-api';
import { system } from '@minecraft/server';
import { BedrockDedicatedServerEnvironment } from '../main';
import { TestSuite } from '../suite';
import { TestsReport } from './provider';

registerScriptApiDumpReporters<TestsReport>({
   tests: () => {
      return TestSuite.runThread(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
   },
});
