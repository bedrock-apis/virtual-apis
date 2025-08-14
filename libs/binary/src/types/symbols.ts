import { IndexId } from './general';

// Max is 3 bits 0-7 value
export enum ExportType {
   Class = 0 << 12,
   Constant = 1 << 12,
   Enum = 2 << 12,
   Error = 3 << 12,
   Function = 4 << 12,

   Interface = 5 << 12,
   Object = 6 << 12,
}
export enum SymbolBitFlags {
   IsExportedSymbol = 1 << 15,

   // Next is export kind 3bits
   ExportTypeMask = 0b01110000_00000000,

   IsBound = 1 << 11, // Reads up boundType

   /** Reads privileges */
   IsInvocable = 1 << 10,
   /** Does non */
   IsProperty = 1 << 9,
   /** Reads setterPrivileges */
   HasSetter = 1 << 8,

   /** Does non */
   IsConstructor = 1 << 7,

   IsBakedProperty = 1 << 6,

   /** Only available if its bind type */
   IsStatic = 1 << 5,

   /** Reads nbt serializable hasValue */
   HasValue = ExportType.Constant,
   /** Reads hasType */
   HasType = 1 << 4,

   /** No effect */
   IsObject = ExportType.Object,
   IsFunction = ExportType.Function,
   /** Read functionArgumentsDetails */
   IsDetailedFunction = 1 << 3,
}

export interface BinarySymbolStruct {
   bitFlags: number;
   name: IndexId;
   isEnumData?: { hasNumericalValues: boolean; keys: IndexId[]; values: number[] };
   isInterfaceData?: { keys: IndexId[]; types: IndexId[] };
   hasValue?: unknown;
   hasType?: IndexId;
   boundTo?: IndexId;
   invocablePrivileges?: IndexId[];
   functionArguments?: IndexId[];
   functionArgumentsDetails?: IndexId[];
   setterPrivileges?: IndexId[];
}
