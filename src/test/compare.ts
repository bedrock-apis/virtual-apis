import results from '../../bds-docs-stable/reports/api.json' with { type: 'json' };
import { runAndCompare } from '../../bds-docs/script-api/test-runner/compare';
import { VirtualApiEnviroment } from './enviroment';

console.log('aahhh');

console.log(runAndCompare(results, new VirtualApiEnviroment()));
