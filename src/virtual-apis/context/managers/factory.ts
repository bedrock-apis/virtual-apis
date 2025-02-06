import { ParamsDefinition, Type } from '../../type-validators';
import { PANIC_ERROR_MESSAGES } from '../../diagnostics';
import { Kernel, KernelArray } from '../../isolation';
import { Context } from '../context';
import { API, APIClassInfo, APIInfo, APIMemberInfo } from './factory.info';
import { createFunctionalConstructor } from '../factory/constructor';
import { ExecutionContext, InstanceExecutionContext } from '../execution-context';
import { createFunctionalGetter } from '../factory/properties';

const keyPattern = Kernel.As(/^([A-z]+)::([A-z]+)(| getter| setter)$/, 'RegExp') as RegExp;
const getBase = (id: string) => keyPattern.exec(id)?.[1] as string;
const getProperty = (id: string) => keyPattern.exec(id)?.[2] as string;

export class ContextFactory extends Kernel.Empty {
   public readonly context: Context;
   public readonly runtime;
   public readonly types;
   public readonly options;
   protected readonly apisLookup = Kernel.Construct('WeakMap') as WeakMap<API, APIInfo>;
   protected readonly apisKeysLookup = Kernel.Construct('Map') as Map<string, APIInfo>;
   public constructor(context: Context) {
      super();
      this.context = context;
      this.runtime = context.runtime;
      this.types = context.typesManager;
      this.options = context.options;
   }
   public createConstructor(
      name: string,
      parent: string | null,
      params: ParamsDefinition | null,
      newExpected: boolean = true,
   ): APIClassInfo {
      // Validate Key
      this.validateKey(ContextFactory.GetCtor(name));

      // Check for inheritance
      let base = null;
      if (parent) {
         base = this.apisKeysLookup.get(parent);
         if (!base)
            throw new Kernel['TypeError::constructor'](
               PANIC_ERROR_MESSAGES.CanNotExtendsFromTypeThatIsNotClass(parent),
            );
         if (!(base instanceof APIClassInfo))
            throw new Kernel['TypeError::constructor'](
               PANIC_ERROR_MESSAGES.CanNotExtendsFromTypeThatIsNotClass(parent),
            );
      }

      // Create API Info
      const info = new APIClassInfo(name, params, base);
      info.newExpected = newExpected;
      info.setAPI(
         createFunctionalConstructor(
            info,
            params => new ExecutionContext(this.context, info, params),
            this.runtime.createConstructorHandler(info),
         ),
      );

      // Implement api inheritance
      if (base) {
         Kernel.__setPrototypeOf(info.api, base.api);
         Kernel.__setPrototypeOf(info.api.prototype, base.api.prototype);
      }
      return info;
   }
   public createProperty(id: string, type: Type, isReadonly: boolean) {
      this.validateKey(id);
      const [cName = '_', pName = '_'] = KernelArray.StringSplit(id, '::').getIterator();
      const cl = this.get(ContextFactory.GetCtor(cName));
      // Check
      if (!cl)
         throw new Kernel['TypeError::constructor'](
            PANIC_ERROR_MESSAGES.ClassNotRegistered(ContextFactory.GetCtor(cName)),
         );

      // Check
      const info = new APIMemberInfo(id, type);
      const api = cl.api;
   }
   protected createPropertyGetter(cl: APIInfo, id: string, type: Type) {
      this.validateKey(id);
      this.validateDuplicity(id);
      const name = getProperty(id);

      const info = new APIMemberInfo(id, type);

      const api = createFunctionalGetter(
         info,
         (that, params) => new InstanceExecutionContext(this.context, info, that, params),
         e => {},
      );
      info.setAPI(api);

      const ctor = Kernel.__getOwnDescriptor(cl.api.prototype, name) ?? {};

      if (ctor.get)
         throw new Kernel['TypeError::constructor'](PANIC_ERROR_MESSAGES.PropertyWithThisNameAlreadyExists(id));
      ctor.get = api;

      Kernel.__defineProperty(cl.api.prototype, name, {
         configurable: true,
         enumerable: false,
         get: ctor.get,
         set: ctor.set,
      });
      return info;
   }
   public createMethod(id: string, params: ParamsDefinition) {}
   public createFunction(id: string, params: ParamsDefinition) {}
   public createConst(id: string, value: unknown) {}
   public getAPIInfo(api: API) {
      return this.apisLookup.get(api) ?? null;
   }
   public get(id: string) {
      return this.apisKeysLookup.get(id) ?? null;
   }
   public register(api: APIInfo) {
      this.apisLookup.set(api.api, api);
      this.apisKeysLookup.set(api.id, api);
   }
   public isRegistered(id: string) {
      return this.apisKeysLookup.has(id);
   }
   public validateDuplicity(id: string) {
      if (this.isRegistered(id)) throw Kernel['TypeError::constructor'](PANIC_ERROR_MESSAGES.DuplicatedAPITypeId(id));
   }
   public validateKey(id: string) {
      if (!keyPattern.test(id)) throw Kernel['TypeError::constructor'](PANIC_ERROR_MESSAGES.InvalidKeyPattern(id));
      this.validateDuplicity(id);
   }
   public static GetCtor(name: string) {
      return `${name}::constructor`;
   }
}
