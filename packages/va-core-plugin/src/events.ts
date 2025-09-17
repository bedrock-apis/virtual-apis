import { VirtualPrivilege } from '@bedrock-apis/va-binary';
import { PluginWithConfig } from '@bedrock-apis/va-pluggable';
import { PluginModuleLoaded } from '@bedrock-apis/va-pluggable/src/module';
import { ServerModuleTypeMap } from '@bedrock-apis/va-pluggable/src/types';
import {
   ConstructableSymbol,
   ContextPluginLinkedStorage,
   MethodSymbol,
   ModuleSymbol,
   PropertyGetterSymbol,
} from '@bedrock-apis/virtual-apis';
import {
   PlayerLeaveBeforeEvent,
   SystemAfterEvents,
   SystemBeforeEvents,
   WorldAfterEvents,
   WorldBeforeEvents,
} from '@minecraft/server';

interface Config {
   warnIfEventIsNotImplemented: boolean;
}

interface Groups {
   systemAfter: SystemAfterEvents;
   systemBefore: SystemBeforeEvents;
   worldAfter: WorldAfterEvents;
   worldBefore: WorldBeforeEvents;
}

const groupsMap: Record<keyof Groups, keyof ServerModuleTypeMap> = {
   systemAfter: 'SystemAfterEvents',
   systemBefore: 'SystemBeforeEvents',
   worldAfter: 'WorldAfterEvents',
   worldBefore: 'WorldBeforeEvents',
};

type Events<T extends SystemAfterEvents | SystemBeforeEvents | WorldBeforeEvents | WorldAfterEvents> = {
   [K in keyof T]: T[K] extends { subscribe(c: (a: infer A) => void): void } ? A : never;
};

type EventsWithFilters<T extends SystemAfterEvents | SystemBeforeEvents | WorldBeforeEvents | WorldAfterEvents> = {
   [K in keyof T as T[K] extends { subscribe(c: (a: infer A) => void, filter: infer B): void }
      ? B extends object
         ? K
         : never
      : never]: T[K] extends { subscribe(c: (a: infer A) => void, filter: infer B): void }
      ? B extends object
         ? { event: A; filter: B }
         : never
      : never;
};

type BaseListener = (...args: unknown[]) => unknown;

export class EventsPlugin extends PluginWithConfig<Config> {
   protected static getEventId(group: string, event: string) {
      return `${group}::${event}`;
   }

   public config: Config = {
      warnIfEventIsNotImplemented: true,
   };

   public events = new Map<string, Map<BaseListener, object>>();

   public implementedEvents = new Set<string>();

   public createTrigger<T extends keyof Groups, Event extends keyof Events<Groups[T]>>(
      loaded: PluginModuleLoaded<ServerModuleTypeMap>,
      group: T,
      event: Event,
   ) {
      const { eventClassName, privilege, eventId } = this.processTriggerMetadata<T, Event>(group, String(event));

      return (args: Events<Groups[T]>[Event]) => {
         const p = this.context.currentPrivilege;
         try {
            const argsInstance = loaded.construct(eventClassName as 'PlayerLeaveBeforeEvent');
            this.setStorageOf(argsInstance, args as unknown as PlayerLeaveBeforeEvent);

            this.context.currentPrivilege = privilege;
            for (const listener of this.events.get(eventId)?.keys() ?? []) {
               // Im not sure how to properly call it here but uhh
               listener(argsInstance);
            }
         } finally {
            this.context.currentPrivilege = p;
         }
      };
   }

   private processTriggerMetadata<T extends keyof Groups, Event extends keyof Events<Groups[T]>>(
      group: T,
      event: string,
   ) {
      const eventId = EventsPlugin.getEventId(groupsMap[group], event);
      const before = group.includes('before');
      const privilege = before ? VirtualPrivilege.ReadOnly : VirtualPrivilege.None;
      this.implementedEvents.add(eventId);

      // Example: playerLeave -> PlayerLeaveBeforeEvent
      const eventClassName =
         event === 'startup'
            ? 'StartupEvent' // special case
            : `${event[0]?.toUpperCase()}${event.slice(1)}${before ? 'BeforeEvent' : 'AfterEvent'}`;
      this.implementEventArgument(eventClassName);

      return { eventClassName, privilege, eventId };
   }

   public createTriggerWithFilter<T extends keyof Groups, Event extends keyof EventsWithFilters<Groups[T]>>(
      loaded: PluginModuleLoaded<ServerModuleTypeMap>,
      group: T,
      event: Event,
   ) {
      const { eventClassName, privilege, eventId } = this.processTriggerMetadata(group, String(event));

      return (
         filter: (v: EventsWithFilters<Groups[T]>[Event]['filter']) => boolean,
         args: EventsWithFilters<Groups[T]>[Event]['event'],
      ) => {
         const p = this.context.currentPrivilege;
         try {
            const argsInstance = loaded.construct(eventClassName as 'PlayerLeaveBeforeEvent');
            this.setStorageOf(argsInstance, args as unknown as PlayerLeaveBeforeEvent);

            this.context.currentPrivilege = privilege;
            for (const [listener, filterData] of this.events.get(eventId)?.entries() ?? []) {
               if (!filter(filterData as EventsWithFilters<Groups[T]>[Event]['filter'])) continue;

               // Im not sure how to properly call it here but uhh
               listener(argsInstance);
            }
         } finally {
            this.context.currentPrivilege = p;
         }
      };
   }

   protected eventArgDataStorage = new ContextPluginLinkedStorage<Record<string, unknown>>(() => ({}));

   public getStorageOf<
      T extends ServerModuleTypeMap[Extract<
         keyof ServerModuleTypeMap,
         `${string}${'After' | 'Before'}Event`
      >]['prototype'],
   >(instance: T): Partial<Mutable<T>> {
      return this.eventArgDataStorage.get(instance) as Partial<Mutable<T>>;
   }

   public setStorageOf<
      T extends ServerModuleTypeMap[Extract<
         keyof ServerModuleTypeMap,
         `${string}${'After' | 'Before'}Event`
      >]['prototype'],
   >(instance: T, data: T): void {
      const storage = this.eventArgDataStorage.get(instance);
      Object.assign(storage, data);
   }

   protected implemenetedEventArguments = new Set<string>();

   // Implement arguments
   protected implementEventArgument(className: string) {
      if (this.implemenetedEventArguments.has(className)) return; // Already implemented
      this.implemenetedEventArguments.add(className);

      this.server.onLoad.subscribe((_, versions) => {
         for (const module of versions) {
            const symbol = module.symbols.get(className);
            if (!(symbol instanceof ConstructableSymbol))
               throw new Error(`Symbol ${className} is not event constructable`);

            for (const getter of symbol.prototypeFields.values()) {
               if (getter instanceof PropertyGetterSymbol) {
                  const name = getter.name;
                  const setter = getter.setter;

                  this.context.implement(
                     module.nameVersion,
                     getter.identifier,
                     ctx => {
                        ctx.result = this.eventArgDataStorage.get(ctx.thisObject ?? {})[name];
                     },
                     -1,
                  );

                  if (setter) {
                     this.context.implement(
                        module.nameVersion,
                        setter.identifier,
                        ctx => {
                           this.eventArgDataStorage.get(ctx.thisObject ?? {})[name] = ctx.params[0];
                        },
                        -1,
                     );
                  }
               }
            }
         }
      });
   }

   // Implement subscribe/unsubscribe
   protected _ = this.server.onLoad.subscribe((_, versions) => {
      for (const module of versions) {
         for (const eventsGroup of module.symbols.values()) {
            if (eventsGroup instanceof ConstructableSymbol && eventsGroup.name.endsWith('Events')) {
               this.implementForGroup(eventsGroup, module);
            }
         }
      }
   });

   private implementForGroup(eventsGroup: ConstructableSymbol, module: ModuleSymbol) {
      for (const eventSignalGetter of eventsGroup.prototypeFields.values()) {
         if (eventSignalGetter instanceof PropertyGetterSymbol) {
            const eventSignal = eventSignalGetter.returnType;

            if (!(eventSignal instanceof ConstructableSymbol)) continue;
            const subscribe = eventSignal.prototypeFields.get('subscribe');
            const unsubscribe = eventSignal.prototypeFields.get('unsubscribe');

            if (!(subscribe instanceof MethodSymbol) || !(unsubscribe instanceof MethodSymbol)) continue;

            const eventId = EventsPlugin.getEventId(eventsGroup.name, eventSignalGetter.name);

            this.context.implement(module.nameVersion, subscribe.identifier, ctx => {
               if (!this.implementedEvents.has(eventId) && this.config.warnIfEventIsNotImplemented) {
                  console.warn(`Event ${eventId} is not implemented`);
               }

               const listener = ctx.params[0];
               const filter = ctx.params[1] ?? {};

               let listeners = this.events.get(eventId);
               if (!listeners) this.events.set(eventId, (listeners = new Map()));
               listeners.set(listener as BaseListener, filter);

               ctx.result = ctx.params[0];
            });

            this.context.implement(module.nameVersion, unsubscribe.identifier, ctx => {
               this.events.get(eventId)?.delete(ctx.params[0] as BaseListener);
            });
         }
      }
   }
}

EventsPlugin.register('events');
