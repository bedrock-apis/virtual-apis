import { API_ERRORS_MESSAGES, NativeTypeKind } from '../messages';
import { TypeErrorFactory } from './base';

export class NativeConversionFailedErrorFactory<T extends NativeTypeKind> extends TypeErrorFactory {
   public constructor(type: T) {
      super(API_ERRORS_MESSAGES.NativeConversionFailed(type));
   }
}
