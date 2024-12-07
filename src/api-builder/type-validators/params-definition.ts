import { Kernel } from '../kernel';
import { BaseType } from './base-types';

export class ParamsDefinition {
  public requiredParams: number = 0;
  public params: ArrayLike<BaseType> = Kernel.__setPrototypeOf([], null);
  public addType(type: BaseType, isRequired: boolean) {
    if (this.params.length === this.requiredParams && isRequired) {
      (this.params as unknown[])[this.params.length] = type;
      this.requiredParams = this.params.length;
    } else if (isRequired) {
      throw new (Kernel.Constructor('TypeError'))('Required parameter can not be set after optional was defined');
    } else (this.params as unknown[])[this.params.length] = type;
  }
}
