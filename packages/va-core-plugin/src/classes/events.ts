export class BaseEventHandler {
   public readonly methods = new Set();
   public subscribe(callback: () => void) {}
   public unsubscribe(callback: () => void) {}
}
