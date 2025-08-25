import { BedrockDedicatedServerEnvironment, TestSuite } from '@bedrock-apis/va-test';
import '@bedrock-apis/va-test/suites';

import { system } from '@minecraft/server';
import { TestsReport } from '../../shared';

export function testsResolver(): Promise<TestsReport> {
   return TestSuite.runThread(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
}
