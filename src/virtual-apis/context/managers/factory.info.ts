import type { ParamsDefinition, Type } from '../../type-validators';
import { Kernel } from '../../isolation';

export type API = (this: unknown, ...p: undefined[]) => unknown;
export class APIInfo extends Kernel.Empty {
   public readonly id: string;
   public readonly api: API;
   protected constructor(id: string) {
      super();
      this.id = id;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.api = null!;
   }
   public setAPI(api: API) {
      (this as Mutable<this>).api = api;
   }
}
export class APIMemberInfo extends APIInfo {
   public readonly type;
   public constructor(id: string, type: Type) {
      super(id);
      this.type = type;
   }
}
export class APIFunctionInfo extends APIInfo {
   public readonly params;
   public constructor(id: string, params: ParamsDefinition | null) {
      super(id);
      this.params = params;
   }
}
export class APIClassInfo extends APIFunctionInfo {
   public readonly name;
   public readonly parent: APIClassInfo | null;
   public constructor(name: string, params: ParamsDefinition | null, parent: APIClassInfo | null = null) {
      super(`${name}::constructor`, params);
      this.name = name;
      this.parent = parent;
   }
   public newExpected: boolean = true;
}
