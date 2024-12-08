import { Diagnostics, Errors } from '../errors';
import { BaseType } from './base-types';

export class BooleanType extends BaseType {
  public override validate(diagnostics: Diagnostics, value: unknown): void {
    if (typeof value !== 'boolean') diagnostics.report(Errors.NativeTypeConversationFailed());
  }
}
