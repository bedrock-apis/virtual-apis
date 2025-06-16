import { IndexId } from './general';

export enum TypeBitFlags {
   // Reads Up Next 2 bytes as string ref
   IsBindRef = 1 << 7,
   // - Reads Up Next 2 bytes or more as type ref for Promise or Array
   // - Reads Up Next 4 Bytes as module name and version name for bind type
   IsExtended = 1 << 6, // Special Case
   IsNumber = 1 << 5,
   IsComplex = 1 << 4, // Used for Non Number Types
   IsUnsigned = 1 << 4, // Used for Number Types

   Uint8 = IsNumber | IsUnsigned | 1,
   Uint16 = IsNumber | IsUnsigned | 2,
   Uint32 = IsNumber | IsUnsigned | 3,
   BigUint64 = IsNumber | IsUnsigned | 4,

   Int8 = IsNumber | 1,
   Int16 = IsNumber | 2,
   Int32 = IsNumber | 3,
   BigInt64 = IsNumber | 4,
   Float32 = IsNumber | 5,
   Float64 = IsNumber | 6,

   Unknown = 0x00,
   Undefined = 0x01,
   This = 0x02,
   Boolean = 0x03,
   String = 0x04,
   CallBack = 0x05, //Function, but keep in mind its not type of function but function type, so its better to name it callback

   Optional = IsExtended | 1,
   Array = IsExtended | 2,
   Promise = IsExtended | 3,

   Variant = IsExtended | IsComplex | 1,
   Map = IsExtended | IsComplex | 2,
   Closure = IsExtended | IsComplex | 3, // No Closure type in need and it would be needed in general
   Generator = IsExtended | IsComplex | 4, // Not really possible to cover type system, but we need to fully serialize it with <T, TNext, TReturn>
   Iterator = IsExtended | IsComplex | 5, // Native Iterator pattern not sure how it works yet but needs to be tested well
}

export interface BinaryTypeStruct {
   bitType: number;
   extendedRefs?: IndexId[];
   bindTypeNameId?: IndexId;
   fromModuleInfo?: { nameId?: IndexId; version?: IndexId };
   numberRange?: { max: number; min: number };
}
