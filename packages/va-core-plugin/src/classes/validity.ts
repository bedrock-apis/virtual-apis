import { PluginFeature, VirtualFeatureDecorators } from '@bedrock-apis/va-pluggable';
import {
   DiagnosticsStackReport,
   ErrorFactory,
   InvocableSymbol,
   InvocationInfo,
   PANIC_ERROR_MESSAGES,
} from '@bedrock-apis/virtual-apis';
import { CorePlugin, va } from '../core-plugin';

type Validator = (ctx: InvocationInfo) => boolean;

class ValidityPluginError extends Error {
   public override name = 'ValidityPluginError';
}

class ValidityDecorators extends VirtualFeatureDecorators {
   private isValidCheck(this: null, validator: Validator, ctx: InvocationInfo) {
      ctx.result = validator(ctx);
   }

   private guard(target: string, error: ErrorConstructor, validator: Validator, ctx: InvocationInfo) {
      const isValid = validator(ctx);
      if (!isValid) {
         ctx.diagnostics.errors.report(
            new ErrorFactory(
               `Failed to ${ctx.symbol.kind} ${ctx.symbol.kindShort} '${ctx.symbol.name}' due to ${target} being invalid (has the ${target} been removed?).`,
               error,
            ),
         );
      }
   }

   public isValid({
      ignore = [],
      error = TypeError,
   }: { ignore?: string[]; error?: ErrorConstructor } = {}): PropertyDecorator {
      return (prototype, propertyKey) => {
         const meta = this.getPrototypeMeta(prototype).at(-1)!;
         this.onClassLoad(meta, (cls, plugin) => {
            if (!(plugin instanceof CorePlugin)) throw new Error('Expected core plugin');

            for (const [, symbol] of cls.prototypeFields.entries()) {
               if (!(symbol instanceof InvocableSymbol)) continue;
               if (ignore.includes(symbol.name)) continue;

               const customValidator = (ctx: InvocationInfo) => {
                  const self = plugin.getStorage(ctx.thisObject as object);
                  return Reflect.get(self as object, propertyKey, self);
               };

               plugin.registerCallback(
                  symbol,
                  symbol.name === 'isValid'
                     ? this.isValidCheck.bind(null, customValidator)
                     : this.guard.bind(null, meta.classId, error, customValidator),
                  10,
               );
               if (symbol.name !== 'isValid') {
                  // Since we implement method guard, we need to explicitly mark this as not
                  // implemented in case of return type mismatch
                  plugin.registerCallback(
                     symbol,
                     ctx => {
                        if (!ctx.symbol.returnType.isValidValue(new DiagnosticsStackReport(), ctx.result)) {
                           throw new ValidityPluginError(PANIC_ERROR_MESSAGES.NoImplementation(symbol.identifier));
                        }
                     },
                     -10,
                  );
               }
            }
         });
      };
   }
}

export class ValidityPlugin extends PluginFeature {
   public decorators = new ValidityDecorators(this);
}
const validator = new ValidityPlugin();
export const validityGuard = validator.decorators;
CorePlugin.registerFeature(validator);

export class SimpleIsValid extends va.server.utilityClass([
   'Entity',
   'Block',
   'Structure',
   'ScreenDisplay',
   'Component',
]) {
   @validityGuard.isValid()
   public isValid = true;
}
