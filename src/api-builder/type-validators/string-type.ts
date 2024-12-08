import { Diagnostics, Errors } from '../errors';
import { Type } from './base-types';

export class StringType extends Type {
  public override validate(diagnostics: Diagnostics, value: unknown): void {
    if (typeof value !== 'string') diagnostics.report(Errors.NativeTypeConversationFailed());
  }
}
