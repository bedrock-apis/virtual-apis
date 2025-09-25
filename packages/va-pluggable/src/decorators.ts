import { Pluggable, PluginFeature } from './main';
import { PluginModule } from './module';
import { ModuleTypeMap, ServerModuleTypeMap } from './types';

const onReadySymbol = Symbol('onReady');

// Used by types only
const handleType = Symbol('handleType');

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

class DecoratedClass<T extends object> {
   public [handleType]!: T;
}

type PartialClass<T> = T extends Cls ? { new (): Partial<T['prototype']> & { [handleType]: T['prototype'] } } : T;

class ModuleDecorator<T extends ModuleTypeMap> {
   public class<K extends keyof Constructable<T>>(id: K) {
      return class D extends DecoratedClass<T[K]> {} as PartialClass<T[K]>;
   }

   public constant() {}

   public function() {}

   public [onReadySymbol](module: PluginModule) {}
}

export type PickMatchReverse<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? never : K]: T[K] };

export type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

type HandleType<T> = T extends { [handleType]: infer A } ? (A extends object ? A : never) : never;

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
      this.server[onReadySymbol](plugin.server);
   }

   public server = new ModuleDecorator<ServerModuleTypeMap>();

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(
      id: Id,
   ): Target[PropertyKey] extends Handle[Id]
      ? (target: Target, propertyKey: PropertyKey) => void
      : {
           error: `${Id} should be ${TypeToString<Handle[Id]>}, got ${TypeToString<Target[PropertyKey]>}`;
        } {
      // @ts-expect-error TODO Implement
      return;
   }

   public property<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof SetterProperties<Handle>,
   >(
      id: Id,
   ): Target[PropertyKey] extends Handle[Id]
      ? (target: Target, propertyKey: PropertyKey) => void
      : {
           error: `${TypeToString<Id>} should be ${TypeToString<Handle[Id]>}, got ${TypeToString<Target[PropertyKey]>}`;
        } {
      // @ts-expect-error TODO Implement
      return;
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(
      id: Id,
   ): (
      target: Target,
      propertyKey: PropertyKey,
      descriptor: TypedPropertyDescriptor<Handle[Id]>,
   ) => TypedPropertyDescriptor<Handle[Id]> {
      // @ts-expect-error TODO Implement
      return;
   }
}
