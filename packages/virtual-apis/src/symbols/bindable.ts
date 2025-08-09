import type { Context } from '../context/base';
import type { CompilableSymbol } from './general';

export interface IBindableSymbol extends CompilableSymbol<any> {
   compileAssignment(context: Context, runtime: unknown): void;
}
