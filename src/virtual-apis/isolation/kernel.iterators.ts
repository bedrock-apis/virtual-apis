import { isGeneratorObject, isMapIterator, isSetIterator } from 'node:util/types';
import { Kernel, KernelSymbolCopy } from './kernel';
/* eslint-disable custom/no-globals */

export const GENERATOR_SOURCE = Kernel.IsolatedCopy(
   Object.getPrototypeOf(function* () {}.prototype),
) as Iterator<unknown>;

export const ARRAY_ITERATOR_SOURCE = Kernel.IsolatedCopy(
   // eslint-disable-next-line @typescript-eslint/no-array-constructor
   Object.getPrototypeOf(Array.prototype.values.call(new Array())),
) as Iterator<unknown>;

export const MAP_ITERATOR_SOURCE = Kernel.IsolatedCopy(
   Object.getPrototypeOf(Map.prototype.values.call(new Map())),
) as Iterator<unknown>;

export const SET_ITERATOR_SOURCE = Kernel.IsolatedCopy(
   Object.getPrototypeOf(Set.prototype.values.call(new Set())),
) as Iterator<unknown>;
//@ts-expect-error I hate some of the TS hardcoded things, this is one of them
export const ITERATOR_SOURCE_SYMBOL: unique symbol = Kernel['globalThis::Symbol']('Symbol(Kernel.ITERATOR_SOURCE)');

export interface IsolatedIterator<T> extends IterableIterator<T> {
   readonly [ITERATOR_SOURCE_SYMBOL]: Iterator<T, unknown, unknown>;
}

export class KernelIterator<T> extends Kernel.Empty implements IsolatedIterator<T> {
   private constructor(src: Iterator<T>) {
      super();
      this[ITERATOR_SOURCE_SYMBOL] = src;
   }
   public static readonly isolatedGeneratorPrototype = new KernelIterator(GENERATOR_SOURCE);
   public static readonly isolatedArrayIteratorPrototype = new KernelIterator(ARRAY_ITERATOR_SOURCE);
   public static readonly isolatedMapIteratorPrototype = new KernelIterator(MAP_ITERATOR_SOURCE);
   public static readonly isolatedSetIteratorPrototype = new KernelIterator(SET_ITERATOR_SOURCE);
   // There is no way to know if the iterator is Array iterator or not
   private static From<S>(object: Iterator<S>): KernelIterator<S> {
      if (isGeneratorObject(object)) return Kernel.__setPrototypeOf(object, this.isolatedGeneratorPrototype);
      else if (isMapIterator(object)) return Kernel.__setPrototypeOf(object, this.isolatedMapIteratorPrototype);
      else if (isSetIterator(object)) return Kernel.__setPrototypeOf(object, this.isolatedSetIteratorPrototype);
      throw new Kernel['TypeError::constructor']('object is not native iterator');
   }
   public static FromMapIterator<S>(object: Iterator<S>): KernelIterator<S> {
      return Kernel.__setPrototypeOf(object, this.isolatedMapIteratorPrototype);
   }
   public static FromSetIterator<S>(object: Iterator<S>): KernelIterator<S> {
      return Kernel.__setPrototypeOf(object, this.isolatedSetIteratorPrototype);
   }
   public static FromGenerator<T>(object: Generator<T>): KernelIterator<T> {
      return Kernel.__setPrototypeOf(object, this.isolatedGeneratorPrototype);
   }
   public static FromArrayIterator<T>(object: Iterator<T>): KernelIterator<T> {
      return Kernel.__setPrototypeOf(object, this.isolatedArrayIteratorPrototype);
   }
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   public static SetSafeIterator<T extends (this: any, ...params: any[]) => Generator<S>, S>(
      m: T,
   ): T extends (this: infer N, ...params: infer M) => Generator<S>
      ? (this: N, ...params: M) => KernelIterator<S>
      : never {
      Object.setPrototypeOf(m.prototype, this.isolatedGeneratorPrototype);
      return m as unknown as T extends (this: infer N, ...params: infer M) => Generator<S>
         ? (this: N, ...params: M) => KernelIterator<S>
         : never;
   }
   public [ITERATOR_SOURCE_SYMBOL]: Iterator<T> = null as unknown as Iterator<T>;
   public [KernelSymbolCopy.iterator](): IterableIterator<T> {
      return this;
   }
   public next(v: unknown): IteratorResult<T, void> {
      return Kernel.Call(this[ITERATOR_SOURCE_SYMBOL].next, this, v) as IteratorResult<T, void>;
   }
   public return(value?: unknown): IteratorResult<T, unknown> {
      const ret = this[ITERATOR_SOURCE_SYMBOL].return;
      if (!ret) return { value: undefined, done: true };
      return Kernel.Call(ret, this, value) as IteratorResult<T, void>;
   }
   public throw(e?: unknown): IteratorResult<T, unknown> {
      const ret = this[ITERATOR_SOURCE_SYMBOL].throw;
      if (!ret) return { value: undefined, done: true };
      return Kernel.Call(ret, this, e) as IteratorResult<T, void>;
   }
}
