import { Kernel } from "./kernel";
import { KernelIterator } from "./kernel.iterators";

const MAP = Kernel.CallBindTo(Kernel["Array::prototype"].map);
const FILTER = Kernel.CallBindTo(Kernel["Array::prototype"].filter);
export class KernelArray<T> extends Kernel.Empty {
    private constructor(){super();}
    public length = 0;
    [n: number]: T;
    public static Construct<T>(...params: T[]): KernelArray<T>{ return KernelArray.From(params);     }
    public static From<T>(array: Array<T>): KernelArray<T>{
        return Kernel.__setPrototypeOf(array, KernelArray.prototype);
    }
    public map<S>(n: (e: T, i: number, t: T[])=>S): KernelArray<S>{
        return Kernel.__setPrototypeOf(MAP(this, n), KernelArray.prototype);
    }
    public filter(predicate: (e: T, i: number, t: T[])=>boolean, thisArg?: unknown): KernelArray<T> {
        return Kernel.__setPrototypeOf(FILTER(this, predicate, thisArg), KernelArray.prototype);
    }
    public getIterator(): KernelIterator<T>{
        return KernelIterator.FromArrayIterator(this as unknown as Iterator<T>);
    }
}
Kernel.__setPrototypeOf(KernelArray, Kernel["Array::static"]);
Kernel.__setPrototypeOf(KernelArray.prototype, Kernel["Array::prototype"]);