import type { Context } from '../../context/context';
import type { CompilableSymbol } from './compilable';

export interface IBindableSymbol extends CompilableSymbol<unknown> {
   compileAssignment(context: Context, runtime: unknown): void;
}
