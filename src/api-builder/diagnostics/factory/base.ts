import { Kernel } from '../../kernel';

export type ErrorConstructor = new (message: string) => Error;
export class BaseErrorFactory extends Kernel.Empty {
   public readonly message?: string;
   public constructor(message?: string) {
      super();
      this.message = message;
   }
   public getErrorConstructor(): ErrorConstructor {
      return Kernel['Error::constructor'];
   }
   public getMessage(...params: unknown[]): string {
      return this.message ?? 'Default Base Error Message';
   }
}
export class TypeErrorFactory extends BaseErrorFactory {
   public getErrorConstructor(): ErrorConstructor {
      return Kernel['TypeError::constructor'];
   }
}
export class ReferenceErrorFactory extends BaseErrorFactory {
   public getErrorConstructor(): ErrorConstructor {
      return Kernel['ReferenceError::constructor'];
   }
}
