/* eslint-disable @typescript-eslint/no-explicit-any */

type Resolve<T> = (value: T) => void;
type Reject = (error: any) => void;

export type ThreadRunner = (generator: Generator<void, void, void>) => void;

export const defaultThreadRunner: ThreadRunner = generator => {
   let step = generator.next();
   while (!step.done) {
      step = generator.next();
      if (step.done) return step.value;
   }
};

interface RunThreadAsyncContext<T> {
   resolve: Resolve<T>;
   reject: Reject;
   generator: Generator<unknown | Promise<void>, T, any>;
   nextParam?: undefined | unknown;
   result: IteratorResult<unknown, PromiseLike<void>> | IteratorReturnResult<T>;
   runner: ThreadRunner;
}

export function runThreadAsync<T>(generator: Generator<unknown | Promise<void>, T, any>, runner: ThreadRunner) {
   return new Promise<T>((resolve, reject) => {
      try {
         sessionContinue({
            resolve,
            reject,
            generator,
            runner,
            nextParam: undefined,
            result: { done: undefined, value: undefined },
         });
      } catch (error) {
         reject(error);
      }
   });
}
function sessionContinue<T>(ctx: RunThreadAsyncContext<T>) {
   ctx.runner(sessionRunner(ctx));
}
function throwContinue<T>(ctx: RunThreadAsyncContext<T>, error: Error) {
   try {
      ctx.generator.throw(error);
      sessionContinue(ctx);
   } catch (error) {
      ctx.reject(error);
   }
}
function* sessionRunner<T>(ctx: RunThreadAsyncContext<T>) {
   const { generator, resolve, reject } = ctx;
   try {
      ctx.result = generator.next(ctx.nextParam);
      yield;
      while (!ctx.result.done) {
         if (ctx.result.value !== undefined) if (processCore(ctx)) return;
         ctx.result = generator.next(ctx.nextParam);
         yield;
      }
      resolve(ctx.result.value);
   } catch (error) {
      reject(error);
   }
}
function processCore<T>(ctx: RunThreadAsyncContext<T>) {
   const v = ctx.result.value as null | PromiseLike<T>;

   if (v && typeof v['then'] === 'function') {
      Promise.resolve(v).then(
         promiseV => {
            ctx.nextParam = promiseV;
            sessionContinue(ctx);
         },
         e => throwContinue(ctx, e),
      );
      return true;
   }

   return false;
}
