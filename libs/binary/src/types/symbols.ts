import { IndexId } from './general';

export enum SymbolBitFlags {
   IsClass = 1, // No Effect
   IsEnum = 1 << 1, // Reads Up Enum Type and its values
   IsInterface = 1 << 2, // Reads Up Keys and Types
   IsConstant = 1 << 3, //No Effect
   IsError = 1 << 4, //No Effect

   IsInvocable = 1 << 5, // privileges

   IsFunction = 1 << 6, // Read Params
   IsProperty = 1 << 7, // Is Also Invocable
   IsConstructor = 1 << 8, // Also Invocable & meta information

   HasSetter = 1 << 9, // Reads additional Privileges for setter
   IsBakedProperty = 1 << 10,

   IsBindType = 1 << 11, // Reads up BindType
   IsStatic = 1 << 12, // Only available if its BindType
   HasValue = 1 << 13, // Reads NBT Value
   HasType = 1 << 14, // Reads Type
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
