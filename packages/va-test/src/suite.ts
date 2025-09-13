import { defaultThreadRunner, RunThreadAsync, ThreadRunner } from './async-generator';
import { setEnvironment, TestEnvironment } from './environment/environment';
import { TestReport } from './types';

export class TestSuite<T> {
   public static stringify(object: unknown): string {
      if (object === undefined) return 'undefined';
      // TODO Better stringify

      return JSON.stringify(object);
   }

   public static assert(v1: unknown) {
      if (!v1) throw new Error('Assertion failed');
   }

   public static withSetup<T>(id: string, setupFn: () => T) {
      return new TestSuite(id, setupFn);
   }

   public static simple(id: string) {
      return new TestSuite(id, () => {});
   }

   public static runThread(Environment: TestEnvironment, runner: ThreadRunner = defaultThreadRunner) {
      return RunThreadAsync(this.run(Environment), runner);
   }

   public static *run(Environment: TestEnvironment): Generator<Promise<void> | unknown, TestReport.Run, unknown> {
      try {
         setEnvironment(Environment);

         yield Environment.onSetup();
      } catch (e) {
         console.error(e);
         return { EnvironmentSetupError: String(e) };
      }
      yield;

      const suites = [];
      for (const suite of this.suites.values()) {
         if (suite.earlyExecutionResult) {
            suites.push(suite.earlyExecutionResult);
         } else {
            suites.push(yield* suite.run());
         }
      }
      return suites;
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   protected static suites = new Map<string, TestSuite<any>>();

   protected constructor(
      private id: string,
      protected setupFn: () => T,
   ) {
      TestSuite.suites.set(id, this);
   }

   public *run(): Generator<unknown, TestReport.Suite, unknown> {
      let setup;
      try {
         setup = this.setupFn();
         yield;
      } catch (e) {
         return { id: this.id, setupError: String(e) };
      }

      const results: (TestReport.Chained | TestReport.Primitive)[] = [];
      for (const test of this.collectedTests) {
         const result = test(setup);
         results.push(result);
         yield;
      }

      return { id: this.id, results: results };
   }

   protected collectedTests: ((setupData: T) => TestReport.Chained | TestReport.Primitive)[] = [];

   public test(testFn: (setupData: T) => unknown): this {
      this.collectedTests.push(setupData => {
         try {
            const result = testFn(setupData);
            // console.log(testFn.toString(), result);
            return TestSuite.stringify(result);
         } catch (error) {
            return this.createErrorReport(error);
         }
      });
      return this;
   }

   public tests(testFns: ((setupData: T) => unknown)[]) {
      testFns.forEach(e => this.test(e));
      return this;
   }

   private createErrorReport(error: unknown): TestReport.Primitive {
      return { error: String(error) };
   }

   public testChain(testFn: (setupData: T) => Generator<unknown, void, unknown>) {
      this.collectedTests.push(setupData => {
         const results: string[] = [];
         try {
            for (const iteration of testFn(setupData)) {
               results.push(TestSuite.stringify(iteration));
            }

            return results;
         } catch (error) {
            return [...results, this.createErrorReport(error)];
         }
      });
      return this;
   }

   protected earlyExecutionResult: TestReport.Suite | undefined;

   public runEarlyExecution() {
      const gen = this.run();
      let v = gen.next();
      while (!v.done) {
         v = gen.next();
         if (v.done) this.earlyExecutionResult = v.value;
      }
   }
}
