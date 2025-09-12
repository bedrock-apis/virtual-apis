import {
   ConstructableSymbol,
   ContextPlugin,
   MethodSymbol,
   ModuleSymbol,
   PropertyGetterSymbol,
} from '@bedrock-apis/virtual-apis';
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

export class EventsPlugin extends ContextPlugin {
   public config: Config = {
      warnIfEventIsNotImplemented: true,
   };

   public events = new Map<string, Map<BaseListener, object>>();

   public implementedEvents = new Set<string>();

   public createTrigger<T extends keyof Groups, Event extends keyof Events<Groups[T]>>(group: T, event: Event) {
      const eventId = `${group}::${String(event)}`;
      this.implementedEvents.add(eventId);
      return (args: Events<Groups[T]>[Event]) => {
         for (const listener of this.events.get(eventId)?.keys() ?? []) {
            // Im not sure how to properly call it here but uhh
            listener(args);
         }
      };
   }

   public createTriggerWithFilter<T extends keyof Groups, Event extends keyof EventsWithFilters<Groups[T]>>(
      group: T,
      event: Event,
   ) {
      const eventId = `${group}::${String(event)}`;
      this.implementedEvents.add(eventId);
      return (
         filter: (v: EventsWithFilters<Groups[T]>[Event]['filter']) => boolean,
         args: EventsWithFilters<Groups[T]>[Event]['event'],
      ) => {
         for (const [listener, filterData] of this.events.get(eventId)?.entries() ?? []) {
            if (!filter(filterData as EventsWithFilters<Groups[T]>[Event]['filter'])) continue;

            // Im not sure how to properly call it here but uhh
            listener(args);
         }
      };
   }

   public override onAfterModuleCompilation(module: ModuleSymbol): void {
      if (module.name !== '@minecraft/server') return;

      for (const eventsGroup of module.symbols) {
         if (eventsGroup instanceof ConstructableSymbol) {
            if (eventsGroup.name.endsWith('Events')) {
               for (const eventSignalGetter of eventsGroup.prototypeFields.values()) {
                  if (eventSignalGetter instanceof PropertyGetterSymbol) {
                     const eventSignal = eventSignalGetter.returnType;

                     if (!(eventSignal instanceof ConstructableSymbol)) continue;
                     const subscribe = eventSignal.prototypeFields.get('subscribe');
                     const unsubscribe = eventSignal.prototypeFields.get('unsubscribe');

                     if (!(subscribe instanceof MethodSymbol) || !(unsubscribe instanceof MethodSymbol)) continue;

                     const eventId = eventsGroup.name + '::' + eventSignal.name;

                     this.context.implement(subscribe.identifier, ctx => {
                        if (!this.implementedEvents.has(eventId) && this.config.warnIfEventIsNotImplemented) {
                           console.warn('Event', eventId, 'is not implemented');
                        }

                        const listener = ctx.params[0];
                        const filter = ctx.params[1] ?? {};

                        let listeners = this.events.get(eventId);
                        if (!listeners) this.events.set(eventId, (listeners = new Map()));
                        listeners.set(listener as BaseListener, filter);

                        ctx.result = ctx.params[0];
                     });

                     this.context.implement(unsubscribe.identifier, ctx => {
                        this.events.get(eventId)?.delete(ctx.params[0] as BaseListener);
                     });
                  }
               }
            }
         }
      }
   }
}

EventsPlugin.register('events');
