import {
   generatedModules,
   GeneratedModuleTypes,
   ModuleTypeMap,
   PluginFeature,
   VirtualFeatureDecorators,
   withGeneratedModules,
} from '@bedrock-apis/va-pluggable';
import { FunctionSymbol, MethodSymbol } from '@bedrock-apis/virtual-apis';

// Used by types only
const handleType = Symbol('handleType');
const staticType = Symbol('staticType');

type Prototyped = { prototype: object };

type Constructable<T extends ModuleTypeMap> = PickMatch<T, Prototyped>;

class ModuleDecorator<T extends ModuleTypeMap> extends VirtualFeatureDecorators {
   public constructor(
      protected feature: PluginFeature,
      private readonly nameVersion: string,
   ) {
      super(feature);
   }

   public utilityClass<K extends keyof Constructable<T>>(ids: K[]) {
      const version = this.nameVersion;
      function virtualClass() {}

      this.assignMetadata(
         virtualClass,
         ids.map(e => ({ classId: e as string, moduleNameVersion: version })),
      );

      type Handle = T[K]['prototype'] extends object ? T[K]['prototype'] : { error: 'prototype is not an object' };
      type Static = Omit<T[K], keyof CallableFunction>;

      return virtualClass as unknown as {
         new (): { [handleType]: Handle };
         [staticType]: Static;
      };
   }

   public class<K extends keyof Constructable<T>, P extends Prototyped>(id: K, parent?: P) {
      const version = this.nameVersion;
      function virtualClass() {}
      if (parent) {
         Object.setPrototypeOf(virtualClass, parent);
         Object.setPrototypeOf(virtualClass['prototype'], parent['prototype']);
      }

      this.assignMetadata(virtualClass, [{ classId: id as string, moduleNameVersion: version }]);

      type Handle = T[K]['prototype'] extends object ? T[K]['prototype'] : { error: 'prototype is not an object' };
      type Static = Omit<T[K], keyof CallableFunction>;

      return virtualClass as unknown as {
         new (): { [handleType]: Handle } & P['prototype'];
         [staticType]: Static;
      } & Omit<P, keyof CallableFunction>;
   }

   public constant(name: string, storage: object) {
      this.registerConstant(this.nameVersion, name, storage);
   }

   public function() {}
}

type PickMatchReverse<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? never : K]: T[K] };

type PickMatch<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? K : never]: T[K] };

type HandleType<T> = T extends { [handleType]: infer A } ? (A extends object ? A : never) : never;
type StaticHandleType<T> = T extends { [staticType]: infer A } ? (A extends object ? A : never) : never;

type Primitive = string | number | bigint | undefined | null | boolean;

type ToStr<T> = T extends Primitive
   ? T
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

type AllowNative<T> = T extends (infer A)[] ? AllowNative<A>[] : T | { [handleType]: T };

// New class = clean api
class PrototypeDecorators extends withGeneratedModules<
   { [K in keyof GeneratedModuleTypes]: ModuleDecorator<GeneratedModuleTypes[K]> },
   typeof VirtualFeatureDecorators
>(VirtualFeatureDecorators) {
   public constructor(protected feature: PluginFeature) {
      super(feature);
      this.static = new StaticDecorators(this.feature);

      for (const f of Object.keys(generatedModules))
         (this as unknown as Record<string, ModuleDecorator<ModuleTypeMap>>)[f] = new ModuleDecorator(this.feature, f);
   }

   public static: StaticDecorators;

   public asHandle<T>(value: T) {
      return value as HandleType<T>;
   }

   public constructable(): ClassDecorator {
      return target => {
         this.registerConstructable(target as unknown as new (...args: unknown[]) => object);
      };
   }

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      return this.property(id) as unknown as Target[PropertyKey] extends AllowNative<Handle[Id]>
         ? (target: Target, propertyKey: PropertyKey) => void
         : { error: `${Id} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}` };
   }

   public property<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof SetterProperties<Handle>,
   >(id: Id) {
      return this.createPropertyDecorator(
         id,
         this.getPrototypeMeta,
      ) as unknown as Target[PropertyKey] extends Handle[Id]
         ? (target: Target, propertyKey: PropertyKey) => void
         : { error: `${ToStr<Id>} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}` };
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(id: Id) {
      return this.createMethodDecorator(id as string, this.getPrototypeMeta, MethodSymbol) as (
         target: Target,
         propertyKey: PropertyKey,
         descriptor: TypedPropertyDescriptor<Handle[Id]>,
      ) => TypedPropertyDescriptor<Handle[Id]>;
   }
}

class StaticDecorators extends VirtualFeatureDecorators {
   public constructor(protected feature: PluginFeature) {
      super(feature);
   }

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      return this.createPropertyDecorator(
         id as string,
         this.getStaticMeta,
      ) as unknown as Target[PropertyKey] extends AllowNative<Handle[Id]>
         ? (target: Target, propertyKey: PropertyKey) => void
         : { error: `${Id} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}` };
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(id: Id) {
      return this.createMethodDecorator(id as string, this.getStaticMeta, FunctionSymbol) as (
         target: Target,
         propertyKey: PropertyKey,
         descriptor: TypedPropertyDescriptor<Handle[Id]>,
      ) => TypedPropertyDescriptor<Handle[Id]>;
   }
}

export class TypedDecoratorsFeature extends PluginFeature {
   public decorators = new PrototypeDecorators(this);
}
