import { Context } from '../../context/context';
import { InvocationInfo } from '../../context/invocation-info';
import { CompileTimeError, NativeActionKind, NativeKind } from '../../errorable';
import { RuntimeType } from '../../runtime-types';
import type { ParamsValidator } from '../../runtime-types/params-validator';
import { ModuleSymbol } from '../module';
import { CompilableSymbol } from './compilable';

export abstract class InvocableSymbol<T> extends CompilableSymbol<T> {
   public readonly returnType!: RuntimeType;
   public readonly params!: ParamsValidator;
   public readonly identifier!: string;
   public readonly paramsLength!: number;
   public abstract readonly kind: NativeKind;
   public abstract readonly actionKind: NativeActionKind;
   public readonly privileges: ('read_only' | 'none' | 'early_execution')[] = [];
   protected readonly stackTrimEncapsulation: number = 1;
   protected runtimeGetResult(info: InvocationInfo): unknown {
      const diagnostics = info.diagnostics;

      // Checks Before
      // This check is here to throw back if this invocable wasn't invoked properly from api side
      if (!diagnostics.success) {
         // Context.report unexpected / type mismatch and others, not plugins fault
         //info.dispose();
         throw diagnostics.throw(this.stackTrimEncapsulation + 1);
      }

      // Call Native constructor and sets its result as new.target.prototype
      this.invoke(info);
      if (!info.isSuccessful) {
         throw info.throw(this.stackTrimEncapsulation + 1);
      }

      // We want to warn that plugin probably returned mismatched type
      this.returnType.isValidValue(diagnostics.warns, info.result);

      // Checks 2
      if (!diagnostics.success) {
         // TODO: What design of our plugin system we want right?
         // definition.__reports(executionContext);
         throw diagnostics.throw(this.stackTrimEncapsulation + 1);
      }
      if (!diagnostics.warns.isEmpty) {
         console.warn(diagnostics.warns.stack.map(e => e.throw()));
      }
      return info.result;
   }
   protected invoke(info: InvocationInfo) {
      info.context.onInvocation(info);
   }
   //#region  SetMethods
   public setPrivileges(privileges: string[]): this {
      if (privileges.some(_ => _ !== 'read_only' && _ !== 'none' && _ !== 'early_execution')) {
         console.warn('Unknown privileges for', this.name, privileges);
      } else {
         (this as Mutable<this>).privileges = privileges as this['privileges'];
      }
      return this;
   }
   public setReturnType(type: RuntimeType): this {
      (this as Mutable<this>).returnType = type;
      return this;
   }
   public setParams(validator: ParamsValidator): this {
      (this as Mutable<this>).params = validator;
      return this;
   }
   public setParamsLength(length: number): this {
      (this as Mutable<this>).paramsLength = length;
      return this;
   }
   public module!: ModuleSymbol;
   public setIdentifier(identifier: string, module: ModuleSymbol): this {
      (this as Mutable<this>).identifier = identifier;
      module.invocables.set(identifier, this);
      this.module = module;
      return this;
   }
   public override precompileChecks(_: Context): void {
      super.precompileChecks(_);
      if (!this.returnType) throw new CompileTimeError('ReturnType is not set, but required for compilation');
      if (!this.params) throw new CompileTimeError('Params are not set, but required for compilation');
   }
   //#endregion
}
