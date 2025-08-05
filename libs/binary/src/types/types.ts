import { IndexId } from './general';

/*
3 bits - Type Determination
*/
export enum TypeBitFlagsU16 {
   // Determination Bits
   // are branching code to different program threads and changes how other bits are interpreted
   IsBindType = 1 << 15,
   IsNumberType = 1 << 14,
   // 1 << 13, Preserved as Determination Bit
   DeterminationBits = IsBindType | IsNumberType | 1 << 13,


   // Informative Bits
   // Just bits with not effect only informative
   IsErrorable = 1 << 12,
   // 1 << 11 Reserved Informative Bit
   // 1 << 10 Reserved Informative Bit


   // Extending Bits
   // Triggers Additional code to be read, but how the data is read is still determined by determination bits
   HasDetails = 1 << 9,
   HasExtraData = 1 << 8,
   HasErrorableExtraData = 1 << 7,
   // 1 << 6, Preserved as Extending Bit

   // Direct Enum Values
   // Determined Bind Types
   IsExternalBit = HasDetails,
   IsExternalBindType = IsBindType | IsExternalBit,

   // Determined Number Types
   IsUnsignedBit = HasDetails,
   
   Uint8 = IsNumberType | IsUnsignedBit | 1,
   Uint16 = IsNumberType | IsUnsignedBit | 2,
   Uint32 = IsNumberType | IsUnsignedBit | 3,
   BigUint64 = IsNumberType | IsUnsignedBit | 4,

   Int8 = IsNumberType | 1,
   Int16 = IsNumberType | 2,
   Int32 = IsNumberType | 3,
   BigInt64 = IsNumberType | 4,
   Float32 = IsNumberType | 5,
   Float64 = IsNumberType | 6,
   
   // Determined Not Number & Not Bind Type
   HasSingleParamBit = HasDetails,
   HasMultiParamsBit = HasExtraData,

   Unknown = 0,
   Undefined = 1,
   This = 2,
   Boolean = 3,
   String = 4,
   CallBack = 5,

   Optional = HasSingleParamBit | Undefined,
   Array = HasSingleParamBit | 2,
   Promise = HasSingleParamBit | 3,


   Variant = HasMultiParamsBit | 1,
   Map = HasMultiParamsBit | 2,
   Closure = HasMultiParamsBit | 3,        // No Closure type in need and it would be needed in general
   Generator = HasMultiParamsBit | 4, // Not really possible to cover type system, but we need to fully serialize it with <T, TNext, TReturn>
   Iterator = HasMultiParamsBit | 5,  // Native Iterator pattern not sure how it works yet but needs to be tested well,
}

// console.log(
//    Object.entries(TypeBitFlags)
//       .filter(([k]) => isNaN(Number(k)))
//       .map(e => [e[0], Number(e[1])])
//       .sort((a, b) => b[1] - a[1])
//       .join('\n'),
// );

export interface BinaryTypeStruct {
   flags: number;
   extendedRef?: IndexId;
   extendedRefs?: IndexId[];
   errorTypes?: IndexId[];
   bindTypeNameId?: IndexId;
   fromModuleInfo?: { nameId?: IndexId; version?: IndexId };
   numberRange?: { max: number; min: number };
}
