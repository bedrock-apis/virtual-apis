/**
 * Represents an event signal.
 *
 * Args - The types of the arguments passed to the event handlers.
 */
export class VaEventEmitter<Args extends unknown[] = unknown[]> {
   protected listeners = new Set<(...params: Args) => void>();
   /**
    * Triggers the event signal.
    *
    * @param params - The arguments to pass to the event handlers.
    */
   public invoke(...params: Args) {
      for (const method of this.listeners.values()) {
         method(...params);
      }
   }
   /**
    * Subscribes to the event signal.
    *
    * @param method - The event handler function to subscribe.
    * @returns The subscribed event handler function.
    */
   public subscribe<M extends (...params: Args) => void>(method: M): M {
      if (!this.listeners.has(method)) this.listeners.add(method);
      return method;
   }

   /**
    * Unsubscribes from the event signal.
    *
    * @param method - The event handler function to unsubscribe.
    * @returns The unsubscribed event handler function.
    */
   public unsubscribe<M extends (...params: Args) => void>(method: M): M {
      this.listeners.delete(method);
      return method;
   }
}
