import { API_ERRORS_MESSAGES, QUICK_JS_ENV_ERROR_MESSAGES } from '../messages';
import { ReferenceErrorFactory, TypeErrorFactory } from './base';

export class NoConstructorErrorFactory extends ReferenceErrorFactory {
   public constructor(id: string) {
      super(API_ERRORS_MESSAGES.NoConstructor(id));
   }
}
export class NewExpectedErrorFactory extends TypeErrorFactory {
   public constructor() {
      super(QUICK_JS_ENV_ERROR_MESSAGES.NewExpected());
   }
}
