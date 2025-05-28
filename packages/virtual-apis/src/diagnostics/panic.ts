import { Kernel } from '@bedrock-apis/kernel-isolation';

export class ContextPanicError extends Kernel['Error::constructor'] {
   public constructor(message: string) {
      super(message);
   }
}
