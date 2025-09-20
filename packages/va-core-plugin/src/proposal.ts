import { ModuleTypeMap, ServerModuleTypeMap } from './multi-version-impl/types';

type Cls = { prototype: object };

export type Constructable<T extends ModuleTypeMap> = {
   [K in keyof T as T[K] extends Cls ? K : never]: T[K] extends Cls ? object : never;
};

class ImplementerModule<T extends ModuleTypeMap> {
   public class<K extends keyof Constructable<T>>(id: K): { new (): { impl: T[K] } } {
      // @ts-expect-error something that i hae
      return;
   }
}

export type PickMatchReverse<T extends object, Filter> = { [K in keyof T as T[K] extends Filter ? never : K]: T[K] };

type GetNativeObject<T, K> = T extends {
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

type EntityR = ReadonlyPick<ServerModuleTypeMap['Entity']['prototype']>;

class Implementer {
   public server = new ImplementerModule<ServerModuleTypeMap>();

   public getter<
      Target,
      PropertyKey extends keyof Target,
      NativeObject extends GetNativeObject<Target, PropertyKey>,
      Id extends keyof ReadonlyPick<PickMatchReverse<NativeObject, CallableFunction>>,
   >(
      id: Id,
   ): Target[PropertyKey] extends NativeObject[Id]
      ? (target: Target, propertyKey: PropertyKey) => void
      : {
           error: `Decorator target should be ${TypeToString<NativeObject[Id]>}, got ${TypeToString<Target[PropertyKey]>}`;
        } {
      // @ts-expect-error something that i hae
      return;
   }

   public prop<
      Target,
      PropertyKey extends keyof Target,
      NativeObject extends GetNativeObject<Target, PropertyKey>,
      Id extends keyof PickMatchReverse<NativeObject, CallableFunction>,
   >(
      id: Id,
   ): (target: Target, propertyKey: PropertyKey, descriptor: TypedPropertyDescriptor<NativeObject[Id]>) => void {
      // @ts-expect-error something that i hae
      return;
   }

   public method<T>(id: keyof T): MethodDecorator {
      // @ts-expect-error something that i hae
      return;
   }
}

export const core = new Implementer();

class Entity extends core.server.class('Entity') {
   @core.getter('isSwimming')
   public properIsSwimming = true;

   @core.getter('isSleeping')
   public get isSomething() {
      return true;
   }

   @core.prop('nameTag')
   public accessor nameTag = '';
}
