import { Pluggable, PluginFeature } from '@bedrock-apis/va-pluggable';
import { PluginModule } from '@bedrock-apis/va-pluggable/src/module';
import { ModuleTypeMap, ServerModuleTypeMap } from '@bedrock-apis/va-pluggable/src/types';
import {
   ConstructableSymbol,
   InvocableSymbol,
   MapWithDefaults,
   MethodSymbol,
   PropertyGetterSymbol,
   VaEventLoader,
} from '@bedrock-apis/virtual-apis';
import { CorePlugin } from './core-plugin';

const onReadySymbol = Symbol('onReady');

// Used by types only
const handleType = Symbol('handleType');
const staticType = Symbol('staticType');
const handleId = Symbol('handleId');
const staticId = Symbol('staticId');

export class DecoratorsFeature extends PluginFeature {
   public decorators = new Decorators(this);

   public override onReady(plugin: CorePlugin): void {
      this.decorators[onReadySymbol](plugin);
      for (const [version, classes] of this.implementations) {
         const module = plugin[version as 'server'];
         module.onLoad.subscribe((_, moduleSymbol) => {
            for (const [classId, implementations] of classes) {
               const classSymbol = moduleSymbol.publicSymbols.get(classId);
               if (!(classSymbol instanceof ConstructableSymbol)) throw new Error(`Not a class: ${classSymbol?.name}`);

               for (const impl of implementations) {
                  impl(classSymbol, plugin);
               }
            }
         });
      }
      this.onReadyEvent.invoke(plugin);
   }

   public onReadyEvent = new VaEventLoader<[CorePlugin]>();

   private implementations = new MapWithDefaults<
      string,
      MapWithDefaults<string, ((s: ConstructableSymbol, plugin: CorePlugin) => void)[]>
   >();

   public onReadyFor<T extends new () => InvocableSymbol<unknown>>(
      id: Id,
      propertyKey: string,
      symbolType: T,
      onReady: (symbol: InstanceType<T>, plugin: CorePlugin) => void,
   ) {
      this.implementations
         .getOrCreate(id.version, () => new MapWithDefaults())
         .getOrCreate(id.classId, () => [])
         .push((s, plugin) => {
            const property = (id.static ? s.staticFields : s.prototypeFields).get(propertyKey);
            if (!(property instanceof symbolType))
               throw new Error(
                  `Unknown ${propertyKey} type: ${property?.constructor.name} expected ${symbolType.name}`,
               );
            onReady(property as InstanceType<T>, plugin);
         });
   }
}

interface Id {
   classId: string;
   version: string;
   static: boolean;
}

function getHandleId(target: object) {
   const id = handleId in target ? target[handleId] : undefined;
   if (!id) throw new Error('no id');
   return id as Id;
}

function getStaticId(target: object) {
   const id = staticId in target ? target[staticId] : undefined;
   if (!id) throw new Error('no id');
   return id as Id;
}

type Prototyped = { prototype: object };

type Constructable<T extends ModuleTypeMap> = PickMatch<T, Prototyped>;

class ModuleDecorator<T extends ModuleTypeMap> {
   public constructor(private readonly name: string) {}

   public class<K extends keyof Constructable<T>>(id: K) {
      const version = this.name;
      function virtualClass() {}
      virtualClass.prototype[handleId] = { classId: id, static: false, version };
      (virtualClass as unknown as { [staticId]: Id })[staticId] = { classId: id as string, static: true, version };

      type Handle = T[K]['prototype'] extends object ? T[K]['prototype'] : { error: 'prototype is not an object' };
      type Static = Omit<T[K], keyof CallableFunction>;
      return virtualClass as unknown as {
         new (): { [handleType]: Handle };
         [staticType]: Static;
      };
   }

   public constant() {}

   public function() {}

   public [onReadySymbol](module: PluginModule) {}
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
class Decorators {
   public static: StaticDecorators;

   public constructor(protected feature: DecoratorsFeature) {
      this.static = new StaticDecorators(this.feature);
   }

   // Symbol to keep api clean
   public [onReadySymbol](plugin: Pluggable) {
      this.server[onReadySymbol](plugin.server);
   }

   public server = new ModuleDecorator<ServerModuleTypeMap>('server');

   public asHandle<T>(value: T) {
      return value as HandleType<T>;
   }

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      return ((target, propertyKey) => {
         const descriptor = Reflect.getOwnPropertyDescriptor(target as object, propertyKey) as PropertyDescriptor;
         const classId = getHandleId(target as object);
         this.feature.onReadyFor(classId, id as string, PropertyGetterSymbol, (symbol, plugin) => {
            if (descriptor?.get) plugin.implement(symbol, ctx => (ctx.result = descriptor.get?.()));
            else plugin.implement(symbol, ctx => (ctx.result = descriptor?.value));
         });
      }) as Target[PropertyKey] extends AllowNative<Handle[Id]>
         ? (target: Target, propertyKey: PropertyKey) => void
         : { error: `${Id} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}` };
   }

   public property<
      Target,
      PropertyKey extends keyof Target,
      Handle extends HandleType<Target>,
      Id extends keyof SetterProperties<Handle>,
   >(id: Id) {
      return ((target, propertyKey) => {
         const descriptor = Reflect.getOwnPropertyDescriptor(target as object, propertyKey) as PropertyDescriptor;
         const classId = getHandleId(target as object);
         this.feature.onReadyFor(classId, id, PropertyGetterSymbol, (symbol, plugin) => {
            if (descriptor?.get) plugin.implement(symbol, ctx => (ctx.result = descriptor.get?.()));
            else plugin.implement(symbol, ctx => (ctx.result = descriptor?.value));

            if (symbol.setter) {
               if (descriptor?.set) plugin.implement(symbol.setter, ctx => descriptor.set?.(ctx.params[0]));
               else plugin.implement(symbol.setter, ctx => (descriptor.value = ctx.params[0]));
            }
         });
      }) as Target[PropertyKey] extends Handle[Id]
         ? (target: Target, propertyKey: PropertyKey) => void
         : { error: `${ToStr<Id>} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}` };
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
      return (target, _, descriptor) => {
         const classId = getHandleId(target as object);
         this.feature.onReadyFor(classId, id as string, MethodSymbol, (symbol, plugin) => {
            const fn = descriptor.value as (args: unknown[]) => void;
            plugin.implement(symbol, ctx => (ctx.result = fn(ctx.params)));
         });
         return descriptor;
      };
   }
}

class StaticDecorators {
   public constructor(protected feature: DecoratorsFeature) {}

   public getter<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof GetterProperties<Handle>,
   >(id: Id) {
      return ((target, propertyKey) => {
         const descriptor = Reflect.getOwnPropertyDescriptor(target as object, propertyKey) as PropertyDescriptor;
         const classId = getStaticId(target as object);
         this.feature.onReadyFor(classId, id as string, PropertyGetterSymbol, (symbol, plugin) => {
            if (descriptor?.get) plugin.implement(symbol, ctx => (ctx.result = descriptor.get?.()));
            else plugin.implement(symbol, ctx => (ctx.result = descriptor?.value));
         });
      }) as Target[PropertyKey] extends AllowNative<Handle[Id]>
         ? (target: Target, propertyKey: PropertyKey) => void
         : {
              error: `${Id} should be ${ToStr<Handle[Id]>}, got ${ToStr<Target[PropertyKey]>}`;
           };
   }

   public method<
      Target,
      PropertyKey extends keyof Target,
      Handle extends StaticHandleType<Target>,
      Id extends keyof FunctionProperties<Handle>,
   >(
      id: Id,
   ): (
      target: Target,
      propertyKey: PropertyKey,
      descriptor: TypedPropertyDescriptor<Handle[Id]>,
   ) => TypedPropertyDescriptor<Handle[Id]> {
      return (target, _, descriptor) => {
         const classId = getStaticId(target as object);
         this.feature.onReadyFor(classId, id as string, MethodSymbol, (symbol, plugin) => {
            const fn = descriptor.value as (args: unknown[]) => void;
            plugin.implement(symbol, ctx => (ctx.result = fn(ctx.params)));
         });
         return descriptor;
      };
   }
}
