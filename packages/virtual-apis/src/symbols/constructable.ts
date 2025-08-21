import { finalizeAsConstructable } from '../ecma-utils';
import { InvocableSymbol } from './abstracts';

import type { Context } from '../context/base';
import { InvocationInfo } from '../context/invocation-info';
import { API_ERRORS_MESSAGES, QUICK_JS_ENV_ERROR_MESSAGES, type DiagnosticsStackReport } from '../errorable';
import { RuntimeType } from '../runtime-types';
import { IBindableSymbol } from './abstracts';

const { setPrototypeOf } = Object;

export class ConstructableSymbol extends InvocableSymbol<new (...params: unknown[]) => unknown> implements RuntimeType {
   public override readonly returnType: RuntimeType = this;
   public readonly handles: WeakSet<object> = new WeakSet();
   public readonly staticFields: Set<IBindableSymbol> = new Set();
   public readonly prototypeFields: Set<IBindableSymbol> = new Set();
   public readonly parent: ConstructableSymbol | null = null;
   public readonly requireNew: boolean = true;
   public readonly isConstructable: boolean = false;
   public createHandleInternal(context: Context): object {
      const handle = this.parent?.createHandleInternal(context) ?? context.createNativeHandle();
      this.handles.add(handle);
      return handle;
   }

   //This is not solve yet, but required for objects to work yet
   public createRuntimeInstanceInternal(context: Context) {
      const $ = this.createHandleInternal(context);
      setPrototypeOf($, this.getRuntimeValue(context).prototype);
      return $;
   }
   public override invoke(info: InvocationInfo): void {
      info.result = this.createHandleInternal(info.context);
      super.invoke(info);
   }
   public override compile(context: Context): new (...params: unknown[]) => unknown {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const symbol = this;
      function constructor(that: unknown, ...params: unknown[]): unknown {
         // new invocation info
         const info = new InvocationInfo(context, symbol, params);
         info.setThisObject(that);
         info.setNewTargetObject(new.target ?? null);
         const { diagnostics } = info;

         // Constructor should be callable only with "NEW" keyword
         if (!new.target && symbol.requireNew) diagnostics.errors.report(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());

         // If constructor is present for this class
         if (!symbol.isConstructable) diagnostics.errors.report(API_ERRORS_MESSAGES.NoConstructor(symbol.identifier));

         symbol.params.isValidValue(diagnostics.errors, info.params);

         return setPrototypeOf(
            symbol.runtimeGetResult(info),
            (new.target as () => unknown)?.prototype ?? constructor.prototype,
         );
      }
      constructor.prototype = { constructor };
      // We don't want to compile its value
      finalizeAsConstructable(
         constructor as unknown as new (...params: unknown[]) => unknown,
         this.name,
         this.paramsLength,
         this.parent?.getRuntimeValue(context) ?? null,
      );

      // Assign all the properties
      // Use .values() as its same for Sets and Maps for future changes
      for (const bindable of this.staticFields.values()) bindable.compileAssignment(context, constructor);
      for (const bindable of this.prototypeFields.values()) bindable.compileAssignment(context, constructor.prototype);

      return constructor as unknown as new (...params: unknown[]) => unknown;
   }
   public isValidValue(diagnostics: DiagnosticsStackReport, value: unknown): boolean {
      const $ = this.handles.has(value as object);
      if (!$) diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type'));
      return $;
   }
   //#region  setMethods
   public setRequireNew(isExpected: boolean): this {
      (this as Mutable<this>).requireNew = isExpected;
      return this;
   }
   public setIsConstructable(isConstructable: boolean): this {
      (this as Mutable<this>).isConstructable = isConstructable;
      return this;
   }
   public setParent(parent: ConstructableSymbol): this {
      (this as Mutable<this>).parent = parent;
      return this;
   }
   //#endregion
}
