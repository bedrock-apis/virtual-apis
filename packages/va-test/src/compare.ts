import { ThreadRunner } from './async-generator';
import { TestEnvironment } from './environment/environment';
import { TestSuite } from './suite';
import { TestReport } from './types';

export async function runAndCompare(
   minecraftResults: TestReport.Run,
   Environment: TestEnvironment,
   runner?: ThreadRunner,
) {
   const result = await TestSuite.runThread(Environment, runner);

   if (!Array.isArray(minecraftResults)) {
      return 'Bds docs Environment setup failed, skipping...';
   }

   if (!Array.isArray(result)) {
      return `Environment setup failed: ${result.EnvironmentSetupError}`;
   }

   let report = '';

   for (const need of minecraftResults) {
      const got = result.find(e => e.id === need.id);

      if (typeof got === 'undefined') {
         report += `No suite ${need.id}. Perhaps you forgot to import suite file.\n`;
         continue;
      }

      const suiteReport = compareSuite(need, got);
      if (suiteReport) {
         const suiteType = 'results' in need && Array.isArray(need.results) ? ' (chained)' : '';
         report += `\n\nSuite ${need.id}${suiteType}: ${indent(suiteReport)}\n`;
      }
   }

   return report.trim();
}

function compareSuite(need: TestReport.Suite, got: TestReport.Suite): string {
   if ('results' in need) {
      if (!('results' in got)) {
         return `❓ Unexpected setup error: ${got.setupError}`;
      }

      return compareMultipleResults(need.results, got.results);
   } else {
      if ('results' in got) {
         return `❌ Expected setup error: ${need.setupError}`;
      }

      if (need.setupError !== got.setupError) {
         return `❌ Setup error mismatch: ${indent(diff(need.setupError, got.setupError))}`;
      }
   }
   return '';
}

function compareResults(need: TestReport.Result, got: TestReport.Result): string {
   if (typeof got === 'undefined') return '❓ Missing test result';

   if (typeof need === 'object' && need) {
      if (Array.isArray(need)) {
         if (!Array.isArray(got)) {
            return '❓ Unexpected primitive result, expected chained';
         } else return compareMultipleResults(need, got);
      }

      if (typeof got !== 'object' || Array.isArray(got)) {
         return `❓ Expected error (${need.error}), got: ${got}`;
      }

      if (need.error !== got.error) return `❌ Error mismatch: ${indent(diff(need.error, got.error))}`;
   } else {
      if (Array.isArray(got)) return '❓ Unexpected chained result, expected primitive';

      if (typeof got === 'object') return `❓ Unexpected error: ${errorResultToString(got)}`;

      if (need !== got) return `❌ Results mismatch: ${indent(diff(need, got))}`;
   }

   return '✅';
}

function compareMultipleResults(needs: TestReport.Result[], gots: TestReport.Result[]): string {
   let report = '';
   for (const [i, need] of needs.entries()) {
      const got = gots[i];
      if (typeof got === 'undefined') {
         report += `${i}: ❓ No result, expected ${resultToString(need)}\n`;
         continue;
      }

      const compare = compareResults(need, got);
      if (compare) {
         report += `${i}: ${indentNotFirst(compare)}\n`;
      }
   }
   return report;
}

function resultToString(result: TestReport.Result): string {
   if (typeof result === 'object' && result && 'error' in result) {
      return errorResultToString(result);
   }

   if (Array.isArray(result)) {
      return result.map(resultToString).join(', ');
   }

   return result;
}

function errorResultToString(result: TestReport.Error): string {
   return result.error;
}

function indentNotFirst(string: string) {
   if (!isMultiline(string)) return string;

   const [first, ...other] = string.split('\n');
   if (!other.length) return first;

   return first + indent(other.join('\n'));
}

function indent(string: string, level = 2) {
   if (!isMultiline(string)) return string;

   const indent = ' '.repeat(level);

   return `\n${indent}${string.replaceAll('\n', `\n${indent}`)}`;
}

function isMultiline(string: string) {
   return string.includes('\n');
}

const wrapDiffLength = 80;

function diff(a: string, b: string) {
   if (!isMultiline(a) && !isMultiline(b) && a.length < wrapDiffLength && b.length < wrapDiffLength) {
      return `${b} != ${a}`;
   }
   const spaces = isMultiline(a) ? '\n\n' : '\n';
   return `\n${a}${spaces}${b}\n`;
}
