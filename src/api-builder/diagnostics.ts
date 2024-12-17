import { Kernel } from './kernel';

export class Report extends Kernel.Empty {
   public constructor(
      public readonly message: string,
      public readonly type: new (message: string) => Error,
   ) {
      super();
   }

   public throw(startStackFrom = 1): never {
      const error = new this.type(this.message);
      if (!error.stack) throw error;

      const [text, ...stack] = error.stack.split('\n    at ');

      error.stack = Kernel.Constructor('Array')
         .of(text, ...stack.slice(startStackFrom))
         .join('\n    at ');
      throw error;
   }
}
export class DiagnosticsStack extends Kernel.Empty {
   public readonly stack = Kernel.NewArray<Report>();
   public get length() {
      return this.stack.length;
   }
   public report<T extends string | Report>(
      ...params: T extends string ? [message: T, errorType: Report['type']] : [...report: T[]]
   ): this {
      if (typeof params[0] === 'string') {
         this.stack.push(new Report(params[0], params[1] as Report['type']));
      } else {
         this.stack.push(...(params as Report[]));
      }
      return this;
   }
   public throw(startStackFrom = 2): never {
      this.stack[0]?.throw(startStackFrom + 1);
      throw Kernel.Construct('Error', 'Failed to throw report error on successful diagnostics instance');
   }
   public get isEmpty() {
      return this.length === 0;
   }
}
export class Diagnostics extends Kernel.Empty {
   public get success() {
      return this.errors.length === 0;
   }
   public get isEmpty() {
      return this.errors.isEmpty && this.warns.isEmpty;
   }
   public readonly errors = new DiagnosticsStack();
   public readonly warns = new DiagnosticsStack();
   public throw(startStackFrom = 2): never {
      return this.errors.throw(startStackFrom + 1);
   }
}
