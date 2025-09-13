import { VirtualPrivilege } from '@bedrock-apis/binary';
import { PluginWithConfig } from '@bedrock-apis/va-pluggable';
import { ServerModuleTypeMap } from '@bedrock-apis/va-pluggable/src/types';
import { ConstructableSymbol, MethodSymbol, ModuleSymbol, PropertyGetterSymbol } from '@bedrock-apis/virtual-apis';
import { SystemAfterEvents, SystemBeforeEvents, WorldAfterEvents, WorldBeforeEvents } from '@minecraft/server';

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

   public createTrigger<T extends keyof Groups, Event extends keyof Events<Groups[T]>>(group: T, event: Event) {
      const eventId = EventsPlugin.getEventId(groupsMap[group], String(event));
      const privilege = group.includes('before') ? VirtualPrivilege.ReadOnly : VirtualPrivilege.None;
      this.implementedEvents.add(eventId);
      return (args: Events<Groups[T]>[Event]) => {
         const p = this.context.currentPrivilege;
         try {
            this.context.currentPrivilege = privilege;
            for (const listener of this.events.get(eventId)?.keys() ?? []) {
               // Im not sure how to properly call it here but uhh
               listener(args);
            }
         } finally {
            this.context.currentPrivilege = p;
         }
      };
   }

   public createTriggerWithFilter<T extends keyof Groups, Event extends keyof EventsWithFilters<Groups[T]>>(
      group: T,
      event: Event,
   ) {
      const eventId = EventsPlugin.getEventId(groupsMap[group], String(event));
      const privilege = group.includes('before') ? VirtualPrivilege.ReadOnly : VirtualPrivilege.None;
      this.implementedEvents.add(eventId);
      return (
         filter: (v: EventsWithFilters<Groups[T]>[Event]['filter']) => boolean,
         args: EventsWithFilters<Groups[T]>[Event]['event'],
      ) => {
         const p = this.context.currentPrivilege;
         try {
            this.context.currentPrivilege = privilege;
            for (const [listener, filterData] of this.events.get(eventId)?.entries() ?? []) {
               if (!filter(filterData as EventsWithFilters<Groups[T]>[Event]['filter'])) continue;

               // Im not sure how to properly call it here but uhh
               listener(args);
            }
         } finally {
            this.context.currentPrivilege = p;
         }
      };
   }

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
