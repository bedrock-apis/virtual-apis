import { registerScriptApiDumpReporters } from '@bedrock-apis/va-bds-dumps/mc-api';
import { TestsReport } from './provider';
import { TestSuite } from '../suite';
import { BedrockDedicatedServerEnvironment } from '../main';
import { system } from '@minecraft/server';

registerScriptApiDumpReporters<TestsReport>({
   tests: () => {
      return TestSuite.runThread(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
   },
});
