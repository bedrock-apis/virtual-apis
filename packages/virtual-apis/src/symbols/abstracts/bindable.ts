import type { Context } from '../../context/base';
import type { CompilableSymbol } from './compilable';

export interface IBindableSymbol extends CompilableSymbol<unknown> {
   compileAssignment(context: Context, runtime: unknown): void;
}
