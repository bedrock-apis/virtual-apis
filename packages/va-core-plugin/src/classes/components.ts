import { va } from '../decorators';
import { isValid } from './validity';

const isAttached = Symbol('isAttached');

export class Component extends va.server.class('Component') {
   public constructor(
      typeId: string,
      defaultData: object,
      public readonly creator: Components,
   ) {
      super();
      this.typeId = typeId;
      this.defaultData = defaultData;
   }

   @va.getter('typeId') public typeId: string;

   @isValid()
   @va.getter('isValid')
   public get isValid() {
      return this[isAttached] && this.creator.isValid;
   }

   public [isAttached] = true;

   @va.redirect()
   public defaultData: object;
}

export abstract class Components extends va.server.base(['Block', 'Entity', 'ItemStack']) {
   public abstract isValid: boolean;

   private components = new Map<string, Component>();

   protected getComponents() {
      return [...this.components.values()];
   }

   @va.method('getComponent') public getComponent(componentId: string) {
      return this.components.get(componentId);
   }

   public removeComponent(componentId: string) {
      const previous = this.components.get(componentId);
      if (previous) previous[isAttached] = false;

      this.components.delete(componentId);
   }

   public attachComponent(componentId: string, component: Component) {
      this.removeComponent(componentId);
      this.components.set(componentId, component);
   }
}
