import {
   generatedModules,
   GeneratedModuleTypes,
   ModuleTypeMap,
   Pluggable,
   PluginFeature,
   VirtualFeatureDecorators,
   withGeneratedModules,
} from '@bedrock-apis/va-pluggable';
import { FunctionSymbol, MethodSymbol, VaEventEmitter } from '@bedrock-apis/virtual-apis';
import { CorePlugin } from './core-plugin';

const onReady = new VaEventEmitter<[Pluggable]>();
export const utils = new VirtualFeatureDecorators(onReady);

type Prototyped = { prototype: object };

type Constructable<T extends ModuleTypeMap> = PickMatch<T, Prototyped>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export class ModuleDecorator<T extends ModuleTypeMap> {
   public constructor(private readonly nameVersion: string) {}

   public base<K extends keyof Constructable<T>>(ids: K[]) {
      const version = this.nameVersion;
      function virtualClass() {}

      utils.assignMetadata(
         virtualClass,
         ids.map(e => ({ classId: e as string, moduleNameVersion: version })),
      );

      type Handle = T[K]['prototype'] extends object ? T[K]['prototype'] : { error: 'prototype is not an object' };
      type Static = Omit<T[K], keyof CallableFunction>;

      return virtualClass as unknown as {
         new (): { $handleType: Handle };
         $staticType: Static;
      };
   }

   public class<K extends keyof Constructable<T>, P extends Prototyped[]>(id: K, ...parents: P) {
      const version = this.nameVersion;
      function virtualClass(this: object, ...args: unknown[][]) {
         for (const [i, parent] of parents.slice().reverse().entries()) {
            const parentInstance = new (parent as unknown as new (...args: unknown[]) => object)(...args[i]!);
            copyProps(this, parentInstance, []);
         }
      }

      const specials = [
         'constructor',
         'prototype',
         'arguments',
         'caller',
         'name',
         'bind',
         'call',
         'apply',
         'toString',
         'length',
      ] as (string | symbol)[];

      // this function copies all properties and symbols, filtering out some special ones
      function copyProps(target: object, source: object, filter = specials) {
         for (const prop of [...Object.getOwnPropertyNames(source), ...Object.getOwnPropertySymbols(source)]) {
            if (!specials.includes(prop)) {
               Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop)!);
            }
         }
      }
      for (const parent of parents) {
         copyProps(virtualClass, parent);
         copyProps(virtualClass['prototype'], parent['prototype']);
      }

      utils.assignMetadata(virtualClass, [{ classId: id as string, moduleNameVersion: version }]);

      type Handle = T[K]['prototype'] extends object ? T[K]['prototype'] : { error: 'prototype is not an object' };
      type Static = Omit<T[K], keyof CallableFunction>;

      type ParentPrototype =
         UnionToIntersection<P[number]> extends Prototyped ? UnionToIntersection<P[number]>['prototype'] : object;

      type ParentStatic = Omit<UnionToIntersection<P[number]>, keyof CallableFunction | '$staticType'>;

      return virtualClass as unknown as {
         new (...args: { [K in keyof P]: P[K] extends abstract new (...args: infer P) => void ? P : [] }): {
            $handleType: Handle;
         } & ParentPrototype;

         $staticType: Static;
      } & ParentStatic;
   }

   public constant(name: string, storage: object) {
      utils.registerConstant(this.nameVersion, name, storage);
   }

   public function() {}
}

type PickMatchReverse<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? never : K]: T[K] };

type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

type MaybeHandleType<T> = T extends unknown[] ? HandleArray<T> : T extends { $handleType: infer A } ? A : T;

type HandleType<T> = T extends { $handleType: infer A } ? (A extends object ? A : never) : never;
type StaticHandleType<T> = T extends { $staticType: infer A } ? (A extends object ? A : never) : never;

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type ReadonlyKeys<T> = {
   [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>;
}[keyof T];

type ReadonlyPick<T> = Pick<T, ReadonlyKeys<T>>;

type WriteonlyPick<T> = Omit<T, ReadonlyKeys<T>>;

type SetterProperties<T extends object> = WriteonlyPick<PickMatchReverse<T, CallableFunction>>;

type GetterProperties<T extends object> = ReadonlyPick<PickMatchReverse<T, CallableFunction>>;

type FunctionProperties<T extends object> = PickMatch<T, CallableFunction>;

type HandleArray<T extends unknown[]> = {
   [K in keyof T]: MaybeHandleType<T[K]>;
};

type FnToHandle<T> = T extends (...args: infer Args) => infer R
   ? (...args: HandleArray<Args>) => MaybeHandleType<R>
   : never;

// New class = clean api
export class PrototypeDecorators extends withGeneratedModules<{
   [K in keyof GeneratedModuleTypes]: ModuleDecorator<GeneratedModuleTypes[K]>;
}>() {
   public static = new StaticDecorators();

   public constructor() {
      super();
      for (const f of Object.keys(generatedModules))
         (this as unknown as Record<string, ModuleDecorator<ModuleTypeMap>>)[f] = new ModuleDecorator(f);
   }

   public constructable(): ClassDecorator {
      return target => {
         utils.registerConstructable(target as unknown as new (...args: unknown[]) => object);
      };
   }

   public redirect(): PropertyDecorator {
      return (prototype, propertyKey) => {
         utils.registerCallsRedirect(prototype, propertyKey);
      };
   }

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      return this.property(id) as unknown as Handle[Id] extends MaybeHandleType<Target[PropertyKey]>
         ? (target: Target, propertyKey: PropertyKey) => void
         : {
              id: `${Id}`;
              shouldBe: Handle[Id];
              got: Target[PropertyKey];
           };
   }

   public property<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof SetterProperties<Handle>,
   >(id: Id) {
      type Return =
         Handle[Id] extends MaybeHandleType<Target[PropertyKey]>
            ? (target: Target, propertyKey: PropertyKey) => void
            : { id: `${Id}`; shouldBe: Handle[Id]; got: Target[PropertyKey] };

      return utils.createPropertyDecorator(
         id,
         utils.getPrototypeMeta,
         utils.createGetStorageInstanced,
      ) as unknown as Return;
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(id: Id) {
      type Return =
         Handle[Id] extends FnToHandle<Target[PropertyKey]>
            ? (target: Target, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => PropertyDescriptor
            : {
                 id: `${Id}`;
                 shouldBe: Handle[Id];
                 got: Target[PropertyKey];
              };

      return utils.createMethodDecorator(
         id as string,
         utils.getPrototypeMeta,
         utils.createGetStorageInstanced,
         MethodSymbol,
      ) as unknown as Return;
   }
}

export class StaticDecorators {
   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      type Return =
         Handle[Id] extends MaybeHandleType<Target[PropertyKey]>
            ? (target: Target, propertyKey: PropertyKey) => void
            : {
                 id: `${Id}`;
                 shouldBe: Handle[Id];
                 got: Target[PropertyKey];
              };

      return utils.createPropertyDecorator(
         id as string,
         utils.getStaticMeta,
         utils.createGetStorageStatic,
      ) as unknown as Return;
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(id: Id) {
      type Return =
         Handle[Id] extends FnToHandle<Target[PropertyKey]>
            ? (target: Target, propertyKey: PropertyKey, descriptor: PropertyDescriptor) => PropertyDescriptor
            : {
                 id: `${Id}`;
                 shouldBe: Handle[Id];
                 got: Target[PropertyKey];
              };

      return utils.createMethodDecorator(
         id as string,
         utils.getStaticMeta,
         utils.createGetStorageStatic,
         FunctionSymbol,
      ) as unknown as Return;
   }
}

export class DecoratedClassesFeature extends PluginFeature {
   public override onReady(plugin: Pluggable): void {
      onReady.invoke(plugin);
   }
}
CorePlugin.registerFeature(DecoratedClassesFeature);

export const va = new PrototypeDecorators();
