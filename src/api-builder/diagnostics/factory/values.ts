import { Range } from '../../../script-module-metadata';
import { API_ERRORS_MESSAGES } from '../messages';
import { TypeErrorFactory } from './base';

export class ValueIsNotSupportedErrorFactory extends TypeErrorFactory {
   public constructor(type: string) {
      super(API_ERRORS_MESSAGES.ValueNotSupported(type));
   }
}

export class OutOfRangeErrorFactory<T extends bigint | number> extends TypeErrorFactory {
   public constructor(v: T, range: Range<T, T>) {
      super(API_ERRORS_MESSAGES.OutOfRange(v, range));
   }
}

export class ArrayUnsupportedTypeErrorFactory extends TypeErrorFactory {
   public constructor() {
      super(API_ERRORS_MESSAGES.ArrayUnsupportedType());
   }
}
