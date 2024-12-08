import { Diagnostics, Errors } from '../errors';
import { BaseType } from './base-types';

export class StringType extends BaseType {
  public override validate(diagnostics: Diagnostics, value: unknown): void {
    if (typeof value !== 'string') diagnostics.report(Errors.NativeTypeConversationFailed());
  }
}
