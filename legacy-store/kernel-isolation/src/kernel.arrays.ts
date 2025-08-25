import { Kernel } from './kernel';
import { KernelIterator } from './kernel.iterators';

const MAP = Kernel.CallBindTo(Kernel['Array::prototype'].map);
const FILTER = Kernel.CallBindTo(Kernel['Array::prototype'].filter);
const PUSH = Kernel.CallBindTo(Kernel['Array::prototype'].push);
const ITERATOR = Kernel.CallBindTo(Kernel['Array::prototype'].values);
export class KernelArray<T> extends Kernel.Empty {
   private constructor() {
      super();
      return Kernel.__setPrototypeOf(new Kernel['Array::constructor'](), KernelArray.prototype) as KernelArray<T>;
   }
   public length = 0;
   [n: number]: T;
   public static Construct<T>(...params: T[]): KernelArray<T> {
      return KernelArray.From(params);
   }
   public static FromIterator<T>(iterator: KernelIterator<T>): KernelArray<T> {
      const array = new KernelArray<T>();
      for (const value of iterator) array[array.length++] = value;
      return array;
   }
   public static From<T>(array: ArrayLike<T>): KernelArray<T> {
      return Kernel.__setPrototypeOf(array, KernelArray.prototype);
   }
   public map<S>(n: (e: T, i: number, t: T[]) => S): KernelArray<S> {
      return Kernel.__setPrototypeOf(MAP(this, n), KernelArray.prototype);
   }
   public filter(predicate: (e: T, i: number, t: T[]) => boolean, thisArg?: unknown): KernelArray<T> {
      return Kernel.__setPrototypeOf(FILTER(this, predicate, thisArg), KernelArray.prototype);
   }
   public getIterator(): KernelIterator<T> {
      return KernelIterator.FromArrayIterator(ITERATOR(this) as unknown as Iterator<T>);
   }
   public push(item: T) {
      return PUSH(this, item);
   }
   public asArray(): Array<T> {
      return Kernel.__setPrototypeOf(this, Kernel['Array::prototype']);
   }
}
Kernel.__setPrototypeOf(KernelArray, Kernel['Array::static']);
Kernel.__setPrototypeOf(KernelArray.prototype, Kernel['Array::prototype']);
