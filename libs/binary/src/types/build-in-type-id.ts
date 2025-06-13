export enum BuildInTypeId {
   Unknown = 0x00,
   Symbol = 0x01,
   This = 0xff,

   Number = 0x80,
   Int8 = 0x81,
   Uint8 = 0x82,
   Int16 = 0x83,
   Uint16 = 0x84,
   Int32 = 0x85,
   Uint32 = 0x86,
   BigInt64 = 0x87,
   BigUint64 = 0x88,
   Float32 = 0x89,
   Float64 = 0x8a,

   Undefined = 0x90,
   //Void = 0x90,

   Boolean = 0x91,
   String = 0x92,

   Optional = 0xa0,
   Variant = 0xa1,
   Array = 0xa2,
   Map = 0xa3,

   Promise = 0xa4,
   Function = 0xa5, // No Closure type in need and it would be needed in general
   Generator = 0xa6, // Not really possible to cover type system, but we need to fully serialize it with <T, TNext, TReturn>
   Iterator = 0xa7, // Native Iterator pattern not sure how it works yet but needs to be tested well
}
