import { PluginWithConfig } from '@bedrock-apis/va-pluggable';
import {
   ConstructableSymbol,
   ContextPluginLinkedStorage,
   DiagnosticsStackReport,
   ErrorFactory,
   InvocableSymbol,
   InvocationInfo,
   PANIC_ERROR_MESSAGES,
} from '@bedrock-apis/virtual-apis';

interface Config {
   defaultIsValid: boolean;
}

type Storage = ContextPluginLinkedStorage<{
   isValid: boolean;
}>;

type Validator = (ctx: InvocationInfo) => boolean;

interface ValidatorOptions {
   error?: typeof Error;
   ignore?: string[];
   isValidByDefault?: boolean;
   customValidator?: Validator;
}

class ValidityPluginError extends Error {
   public override name = 'ValidityPluginError';
}

export class ValidityPlugin extends PluginWithConfig<Config> {
   protected override config: Config = {
      defaultIsValid: false,
   };

   private isValidCheck(this: null, validator: Validator, ctx: InvocationInfo) {
      ctx.result = validator(ctx);
   }

   private guard(target: string, error: ErrorConstructor, validator: Validator, ctx: InvocationInfo) {
      const isValid = validator(ctx);
      if (!isValid) {
         ctx.diagnostics.errors.report(
            new ErrorFactory(
               `Failed to ${ctx.symbol.actionKind} ${ctx.symbol.kind} '${ctx.symbol.name}' due to ${target} being invalid (has the ${target} been removed?).`,
               error,
            ),
         );
      }
   }

   public createValidator(
      target: 'Player' | 'Entity' | 'Block' | 'ItemStack' | 'Structure' | 'ScreenDisplay' | 'Component',
      { ignore = [], error = TypeError, isValidByDefault, customValidator }: ValidatorOptions,
   ) {
      const storage = new ContextPluginLinkedStorage(() => ({
         isValid: isValidByDefault ?? this.config.defaultIsValid,
      }));
      customValidator ??= ctx => {
         return storage.get(ctx.thisObject ?? {}).isValid;
      };
      this.server_above_v2_0_0.onLoad.subscribe((_, versions) => {
         for (const version of versions) {
            const cls = version.symbols.get(target);
            if (!cls) throw new Error(`Not found ${target} in ${version.nameVersion}`);
            if (!(cls instanceof ConstructableSymbol)) throw new Error(`${cls.name} is not class`);

            for (const [, symbol] of cls.prototypeFields.entries()) {
               if (!(symbol instanceof InvocableSymbol)) continue;
               if (ignore.includes(symbol.name)) continue;

               this.context.implement(
                  version.nameVersion,
                  symbol.identifier,
                  symbol.name === 'isValid'
                     ? this.isValidCheck.bind(null, customValidator)
                     : this.guard.bind(null, target, error, customValidator),
                  10,
               );
               if (symbol.name !== 'isValid') {
                  // Since we implement method guard, we need to explicily mark this as not
                  // implemented in case of return type mismatch
                  this.context.implement(
                     version.nameVersion,
                     symbol.identifier,
                     ctx => {
                        if (!ctx.symbol.returnType.isValidValue(new DiagnosticsStackReport(), ctx.result)) {
                           throw new ValidityPluginError(PANIC_ERROR_MESSAGES.NoImplementation(symbol.identifier));
                        }
                     },
                     -10,
                  );
               }
            }
         }
      });

      return {
         invalidate(instance: object) {
            storage.get(instance).isValid = false;
         },
         validate(instance: object) {
            storage.get(instance).isValid = true;
         },
      };
   }

   public entity = this.createValidator('Entity', {
      // They don't export it lol
      error: class InvalidActorError extends Error {
         public override name = 'InvalidActorError';
      } as typeof Error,
   });

   public block = this.createValidator('Block', { error: TypeError });
}
ValidityPlugin.register('validity');
