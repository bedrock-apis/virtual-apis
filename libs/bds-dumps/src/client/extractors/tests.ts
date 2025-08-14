import { BedrockDedicatedServerEnvironment, TestSuite } from '@bedrock-apis/va-test';
import '@bedrock-apis/va-test/suites';

import { system } from '@minecraft/server';

export function testsResolver() {
   return TestSuite.runThread(new BedrockDedicatedServerEnvironment(), system.runJob.bind(system));
}
