import { Kernel, KernelArray } from '@bedrock-apis/kernel-isolation';
import { NativeEvent } from '../../events';
import { ClassBindType, ParamsDefinition } from '../../type-validators';
import { ConstructionExecutionContext, ExecutionContext, InstanceExecutionContext } from '../execution-context';
import { createConstructorFor } from '../factory';
import { ModuleContext } from '../module-context';
import { FunctionAPISymbol } from './function';
import { GetterAPISymbol } from './getter';
import { MethodAPISymbol } from './method';
import { SetterAPISymbol } from './setter';
import { APISymbol } from './symbol';

export type BaseExecutionParams<E extends ExecutionContext = ExecutionContext> = [
   handle: object,
   cache: object,
   ClassAPISymbol | null,
   E,
];

export type ClassAPICompiled = {
   new (...any: unknown[]): Record<string, unknown>;
   readonly name: string;
   readonly prototype: Record<string, unknown>;
} & Record<string, unknown>;

export class ClassAPISymbol extends APISymbol<ClassAPICompiled, ClassBindType> {
   private readonly HANDLE_TO_NATIVE_CACHE = Kernel.Construct('WeakMap');
   private readonly NATIVE_TO_HANDLE_CACHE = Kernel.Construct('WeakMap');
   public readonly onConstruct = new NativeEvent<BaseExecutionParams<ConstructionExecutionContext>>();
   public readonly invocables = Kernel.Construct('WeakMap') as WeakMap<
      CallableFunction,
      NativeEvent<BaseExecutionParams>
   >;
   public override readonly type: ClassBindType;
   public readonly newExpected = true;

   /** If specific handle is type of this definition */
   public isThisType(handle: unknown): boolean {
      return this.HANDLE_TO_NATIVE_CACHE.has(handle as object);
   }

   public readonly parent: ClassAPISymbol | null = null;

   public constructor(
      context: ModuleContext,
      name: string,
      // todo replace parent with string id
      public readonly parentId: string | null = null,
      public readonly constructorParams = new ParamsDefinition(),
      public readonly methods: KernelArray<MethodAPISymbol> = KernelArray.Construct(),
      public readonly properties: KernelArray<{
         getter: GetterAPISymbol;
         setter?: SetterAPISymbol;
      }> = KernelArray.Construct(),
      public readonly staticMethods: KernelArray<FunctionAPISymbol> = KernelArray.Construct(),
      public readonly staticProperties: KernelArray<GetterAPISymbol> = KernelArray.Construct(),
   ) {
      super(context, name);
      if (constructorParams) this.invocable(`${name}::constructor`);
      this.type = new ClassBindType(this);
      this.context.registerType(this.name, this.type);
   }

   protected override compile(): ClassAPICompiled {
      const constructorSymbol = this.context.symbols.get(this.name + '::constructor'); // assuming we have dedicated symbol for constructor;

      // todo iterate over all module context symbols to find and set parent and to add all symbols that are this.name == symbol.type.name
      const api = createConstructorFor(this, this.constructorParams);
      if (this.methods) {
         for (const method of this.methods.getIterator()) api.prototype[method.name] = method.api;
      }

      if (this.properties) {
         for (const { getter, setter } of this.properties.getIterator()) {
            Kernel.__defineProperty(api.prototype, getter.name, {
               configurable: true,
               enumerable: true,
               get: getter.api,
               set: setter?.api,
            });
         }
      }

      if (this.staticMethods) {
         for (const method of this.staticMethods.getIterator()) {
            api[method.name] = method.api;
         }
      }

      if (this.staticProperties) {
         for (const property of this.staticProperties.getIterator()) {
            Kernel.__defineProperty(api, property.name, {
               configurable: true,
               enumerable: true,
               get: property.api,
            });
         }
      }

      return api;
   }

   /**
    * @param params IArguments passed by api context, unpredictable but type safe
    * @returns Handle and cache pair
    */
   public __construct(context: ConstructionExecutionContext): KernelArray<object> {
      let data = this.parent?.__construct(context);
      if (!data) data = KernelArray.Construct(Kernel.__create(null), Kernel.__create(null));

      const handle = data[0];
      const cache = data[1];
      if (!cache || !handle) throw new Kernel['globalThis::TypeError']('Cache or handle is undefined');

      this.context.nativeHandles.add(handle);
      this.HANDLE_TO_NATIVE_CACHE.set(handle, cache);
      this.NATIVE_TO_HANDLE_CACHE.set(cache, handle);

      if (this.interactionHandler) {
         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
         this.interactionHandler!(handle, cache, this, context);
         // if (results.successCount !== results.totalCount) {
         // TODO: Some exceptions were throw by plugin calls
         // }
      }

      return data;
   }

   public __call(context: InstanceExecutionContext) {
      if (context.definition) {
         const event = this.context.symbols.get(context.methodId);
         if (event?.interactionHandler) {
            event.interactionHandler(
               context.handle as object,
               // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
               this.HANDLE_TO_NATIVE_CACHE.get(context.handle as object)!,
               this,
               context,
            );
            // if (result.successCount !== result.totalCount) {
            //    Kernel.log(result);
            // }
         }
      }
   }
}
