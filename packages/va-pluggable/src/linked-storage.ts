import { Context } from '@bedrock-apis/virtual-apis';

export class ContextPluginLinkedStorage<T extends object> {
   private readonly storages = new WeakMap<Context, WeakMap<object, T>>();
   protected readonly instances = new WeakMap<Context, WeakMap<T, WeakRef<object>>>();

   public constructor(protected readonly createStorage: (instance: object) => T) {}

   public get(instance: object, context: Context) {
      const storage = this.storages.get(context)?.get(instance);
      if (storage) return storage;
      return this.create(instance, context);
   }

   public create(instance: object, context: Context) {
      const createdStorage = this.createStorage(instance);
      let storages = this.storages.get(context);
      if (!storages) this.storages.set(context, (storages = new WeakMap()));
      storages.set(instance, createdStorage);

      let instances = this.instances.get(context);
      if (!instances) this.instances.set(context, (instances = new WeakMap()));
      instances.set(createdStorage, new WeakRef(instance));

      return createdStorage;
   }

   public getInstance(storage: T, context: Context) {
      return this.instances.get(context)?.get(storage)?.deref();
   }
}
