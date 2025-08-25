import { isGeneratorObject } from 'node:util/types';
import { API_ERRORS_MESSAGES, DiagnosticsStackReport } from '../../errorable';
import { RuntimeType } from '../type';

export const generatorObjectType: RuntimeType = {
   name: 'generator',
   isValidValue(diagnostics: DiagnosticsStackReport, value: unknown) {
      if (!isGeneratorObject(value))
         return diagnostics.report(API_ERRORS_MESSAGES.NativeConversionFailed('type')), false;
      return true;
   },
};
