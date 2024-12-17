import { API_ERRORS_MESSAGES, NativeKind } from '../messages';
import { ReferenceErrorFactory } from './base';

export class NativeBoundToPrototypeErrorFactory extends ReferenceErrorFactory {
   public constructor(kind: NativeKind, id: string) {
      super(API_ERRORS_MESSAGES.NativeBound(kind, id));
   }
}
