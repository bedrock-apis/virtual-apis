import { unlink } from 'fs';
import { Range } from '../../../script-module-metadata';
import { API_ERRORS_MESSAGES } from '../messages';
import { TypeErrorFactory } from './base';

export class IncorrectNumberOfArgumentsErrorFactory extends TypeErrorFactory {
   public constructor(range: Range<number, number>, length: number) {
      super(API_ERRORS_MESSAGES.IncorrectNumberOfArguments(range, length));
   }
}
export class FunctionArgumentBoundsErrorFactory extends TypeErrorFactory {
   public constructor(value: unknown, range: Range<unknown, unknown>, argumentIndex: number) {
      super(API_ERRORS_MESSAGES.FunctionArgumentBounds(value, range, argumentIndex));
   }
}
