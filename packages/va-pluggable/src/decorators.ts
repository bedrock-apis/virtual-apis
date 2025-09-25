import { Pluggable, PluginFeature } from './main';
import { ModuleTypeMap, ServerModuleTypeMap } from './types';

const onReadySymbol = Symbol('onReady');

export class DecoratorsFeature extends PluginFeature {
   public decorators = new Decorators(this);

   public override onReady(plugin: Pluggable): void {
      this.decorators[onReadySymbol](plugin);
   }
}

type Cls = { prototype: object };

export type Constructable<T extends ModuleTypeMap> = {
   [K in keyof T as T[K] extends Cls ? K : never]: T[K] extends Cls ? object : never;
};

class ModuleDecorator<T extends ModuleTypeMap> {
   public class<K extends keyof Constructable<T>>(id: K): { new (): { impl: T[K] } } {
      // @ts-expect-error TODO Implement
      return;
   }

   public constant() {}

   public function() {}
}

export type PickMatchReverse<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? never : K]: T[K] };

export type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

type GetNativeObject<T> = T extends {
   impl: {
      prototype: infer A;
   };
}
   ? A extends object
      ? A
      : never
   : never;

type TypeToString<T> = T extends true
   ? 'boolean'
   : T extends false
     ? 'boolean'
     : T extends number
       ? T
       : T extends string
         ? 'string'
         : T extends { name: infer Name }
           ? Name extends string
              ? `{ name: ${Name}}`
              : 'complex type'
           : 'complex type';

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type ReadonlyKeys<T> = {
   [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, never, P>;
}[keyof T];

type ReadonlyPick<T> = Pick<T, ReadonlyKeys<T>>;

type WriteonlyPick<T> = Omit<T, ReadonlyKeys<T>>;

type SetterProperties<T extends object> = WriteonlyPick<PickMatchReverse<T, CallableFunction>>;

type GetterProperties<T extends object> = ReadonlyPick<PickMatchReverse<T, CallableFunction>>;

type FunctionProperties<T extends object> = PickMatch<T, CallableFunction>;

// New class = clean api
class Decorators {
   public constructor(protected feature: PluginFeature) {}

   // Symbol to keep api clean
   public [onReadySymbol](plugin: Pluggable) {
      // TODO Pass data from plugin.server using symbol to keep api clean
      // this.server;
   }

   public server = new ModuleDecorator<ServerModuleTypeMap>();

   public getter<
      Target,
      PropertyKey extends keyof Target,
      NativeObject extends GetNativeObject<Target>,
      Id extends keyof GetterProperties<NativeObject>,
   >(
      id: Id,
   ): Target[PropertyKey] extends NativeObject[Id]
      ? (target: Target, propertyKey: PropertyKey) => void
      : {
           error: `${Id} should be ${TypeToString<NativeObject[Id]>}, got ${TypeToString<Target[PropertyKey]>}`;
        } {
      // @ts-expect-error TODO Implement
      return;
   }

   public property<
      Target,
      PropertyKey extends keyof Target,
      NativeObject extends GetNativeObject<Target>,
      Id extends keyof SetterProperties<NativeObject>,
   >(
      id: Id,
   ): Target[PropertyKey] extends NativeObject[Id]
      ? (target: Target, propertyKey: PropertyKey) => void
      : {
           error: `${TypeToString<Id>} should be ${TypeToString<NativeObject[Id]>}, got ${TypeToString<Target[PropertyKey]>}`;
        } {
      // @ts-expect-error TODO Implement
      return;
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      NativeObject extends GetNativeObject<Target>,
      Id extends keyof FunctionProperties<NativeObject>,
   >(
      id: Id,
   ): (
      target: Target,
      propertyKey: PropertyKey,
      descriptor: TypedPropertyDescriptor<NativeObject[Id]>,
   ) => TypedPropertyDescriptor<NativeObject[Id]> {
      // @ts-expect-error TODO Implement
      return;
   }
}
