import { IndexId } from './general';

export enum SymbolBitFlags {
   /** No effect */
   IsClass = 1,
   /** Reads isEnumData */
   IsEnum = 1 << 1,
   /** Reads isInterfaceData */
   IsInterface = 1 << 2,
   /** No Effect */
   IsConstant = 1 << 3,
   /** No Effect */
   IsError = 1 << 4,
   /** Reads privileges */
   IsInvocable = 1 << 5,

   /** Read Params */
   IsFunction = 1 << 6,
   /** Reads privileges */
   IsProperty = 1 << 7,
   /** Reads privileges & meta information */
   IsConstructor = 1 << 8,

   /** Reads setterPrivileges */
   HasSetter = 1 << 9,
   IsBakedProperty = 1 << 10,

   /** Reads BindType */
   IsBindType = 1 << 11, // Reads up BindType
   /** Only available if its bind type */
   IsStatic = 1 << 12,

   /** Reads nbt serializable hasValue */
   HasValue = 1 << 13,
   /** Reads hassType */
   HasType = 1 << 14,

   /** No effect */
   IsObject = 1 << 15,
}

export interface SerializableSymbol {
   bitFlags: number;
   name: IndexId;
   isEnumData?: { hasNumericalValues: boolean; keys: IndexId[]; values?: number[] };
   isInterfaceData?: { keys: IndexId[]; types: IndexId[] };
   hasValue?: unknown;
   hasType?: IndexId;
   bindType?: IndexId;
   invocablePrivileges?: IndexId[];
   functionArguments?: IndexId[];
   setterPrivileges?: IndexId[];
}
