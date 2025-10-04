// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck Needs rewrite

import { Plugin } from '@bedrock-apis/va-pluggable';
import type { Entity, EntityComponent, ItemComponent, ItemStack } from '@minecraft/server';
import { ValidityPlugin } from '../classes/validity';

// TODO Implement it to use system like EventsPlugin.implementEventArgument

export class ComponentsPlugin extends Plugin {
   public addComponents(
      target: 'Player' | 'Entity' | 'ItemStack',
      defaultData: Record<string, Record<string, object>>,
      typeMap: Record<string, `minecraft:${string}`>,
   ) {
      const typeMapReverse = Object.fromEntries(Object.entries(typeMap).map(([k, v]) => [v, k]));

      // Item stack does not have is valid method
      if (target !== 'ItemStack') {
         const validator = this.getPlugin(ValidityPlugin);
         for (const componentClassId of Object.keys(typeMap)) {
            // TODO Pull data from type aliases
            const id =
               componentClassId === 'CursorInventory'
                  ? 'PlayerCursorInventoryComponent'
                  : `Entity${componentClassId}Component`;
            validator.createValidator(id as 'Component', {
               customValidator: ctx => {
                  try {
                     const instance = this.getOrigin((ctx.thisObject ?? {}) as EntityComponent);
                     return !!instance?.isValid;
                  } catch (e) {
                     console.error('component.isValid custom validator', e);
                  }
                  return false;
               },
            });
         }
      }

      return this.server.implementWithStorage(
         target,
         (instance, mod) => {
            const { typeId } = instance;
            const storage = new Map<string, unknown>();
            const metadata = defaultData[typeId] ?? {};

            for (const [key, componentData] of Object.entries(metadata)) {
               const instanceId = typeMapReverse[key]!;
               const componentInstance = mod.construct(instanceId as 'EntityComponent' | 'ItemComponent');
               this.componentToOriginMap.set(componentInstance, new WeakRef(instance));
               this.componentStorages.set(componentInstance, componentData);
               storage.set(key, storage);
            }
            return storage;
         },
         {
            getComponents() {
               return Array.from(this.storage.values()) as unknown as [];
            },
            getComponent(componentId) {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               return this.storage.get(componentId) as unknown as any;
            },
         },
      );
   }

   protected componentStorages = new WeakMap<EntityComponent | ItemComponent, object>();

   protected componentToOriginMap = new WeakMap<EntityComponent | ItemComponent, WeakRef<Entity | ItemStack>>();

   public getOrigin<T extends EntityComponent | ItemComponent>(component: T) {
      return this.componentToOriginMap.get(component)?.deref() as
         | undefined
         | (T extends EntityComponent ? Entity : ItemStack);
   }
}

ComponentsPlugin.register('components');
