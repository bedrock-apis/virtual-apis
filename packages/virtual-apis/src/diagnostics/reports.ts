import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { ContextPanicError, ErrorFactory, PANIC_ERROR_MESSAGES } from './errors';

export abstract class BaseReport {
   public abstract readonly isThrowable: boolean;
   public abstract throw(startStackFrom?: number): Error;
}
export class Report extends BaseReport {
   public readonly isThrowable = true;
   public readonly childReport: BaseReport | null;
   public constructor(
      public readonly factory: ErrorFactory,
      child: BaseReport | null = null,
   ) {
      super();
      this.childReport = child ?? null;
   }
   public override throw(trimStackCount = 0): Error {
      const error = new (this.factory.getErrorConstructor())(this.factory.getMessage());
      removeStackFromError(trimStackCount + 1, error);
      return error;
   }
}

export class DiagnosticsStackReport extends BaseReport {
   public get isThrowable() {
      return !this.isEmpty;
   }
   public get length() {
      return this.stack.length;
   }
   public get isEmpty() {
      return this.length === 0;
   }
   public readonly stack = KernelArray.Construct<Report>();
   public report(...params: [report: Report] | [report: ErrorFactory, child?: BaseReport]): this {
      const report = params[0];
      if (report instanceof Report) this.stack.push(report);
      else this.stack.push(new Report(report, params[1] ?? null));
      return this;
   }
   public override throw(trimStackCount: number = 0): Error {
      return (
         this.stack[0]?.throw(trimStackCount + 1) ??
         new ContextPanicError(PANIC_ERROR_MESSAGES.EmptyDiagnosticsStackInstance)
      );
   }
   public clear() {
      (this as Mutable<this>).stack = KernelArray.Construct<Report>();
   }
   public follow(diagnostics: DiagnosticsStackReport) {
      for (const item of diagnostics.stack.getIterator()) {
         this.stack.push(item);
      }
      return this;
   }
}
export class Diagnostics extends Kernel.Empty {
   public get success() {
      return this.errors.length === 0;
   }
   public get isEmpty() {
      return this.errors.isEmpty && this.warns.isEmpty;
   }
   public readonly errors = new DiagnosticsStackReport();
   public readonly warns = new DiagnosticsStackReport();
   public throw(trimStackCount: number = 0): Error {
      throw this.errors.throw(trimStackCount + 1);
   }
}

export function removeStackFromError(stackSize: number, error: Error) {
   if (!error.stack) return error;
   const [text, ...stack] = error.stack.split('\n    at ');
   error.stack = Array.of(text, ...stack.slice(stackSize)).join('\n    at ');
   return error;
}
