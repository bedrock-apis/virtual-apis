import { ERRORS } from '../../errors';
import { DiagnosticsStack } from '../../diagnostics';
import { Kernel } from '../../kernel';
import { Type } from '../type';

export class InterfaceBindType extends Type {
   public readonly properties = Kernel.Construct('Map') as Map<string, Type>;
   public constructor(public name: string) {
      super();
   }
   public addProperty(name: string, type: Type) {
      this.properties.set(name, type);
      return this;
   }
   public validate(diagnostics: DiagnosticsStack, object: unknown) {
      if (typeof object !== 'object' || object === null) return diagnostics.report(ERRORS.NativeTypeConversationFailed);

      const interfaceDiagnostics = new DiagnosticsStack();
      for (const [propertyKey, type] of this.properties) {
         type.validate(interfaceDiagnostics, (object as Record<string, unknown>)[propertyKey]);
      }

      if (!interfaceDiagnostics.isEmpty) {
         // TODO Ensure that error is native type conversation failed
         diagnostics.report(ERRORS.NativeTypeConversationFailed, ...interfaceDiagnostics.stack);
      }
   }
}
