import { BinaryTypeStruct, TypeBitFlagsU16 } from '@bedrock-apis/binary';
import { BitFlags } from '@bedrock-apis/common';
import {
   ArrayType,
   bigintType,
   booleanType,
   functionType,
   generatorObjectType,
   MapType,
   ModuleSymbol,
   NumberType,
   OptionalType,
   promiseType,
   stringType,
   Type,
   VariantType,
   voidType,
} from '@bedrock-apis/virtual-apis';
import { BinaryImageLoader, PreparedImage } from './image-loader';

const { allOf } = BitFlags;

export class BinaryTypesLoader {
   private static loaders = new Map<ModuleSymbol, BinaryTypesLoader>();
   public constructor(
      private image: PreparedImage,
      mod: ModuleSymbol,
   ) {
      const loader = BinaryTypesLoader.loaders.get(mod);
      if (loader) return loader;

      BinaryTypesLoader.loaders.set(mod, this);
   }

   private cache = new Map<number, Type>();

   public resolveType(index: number | undefined) {
      if (typeof index !== 'number') throw new TypeError('Undefined passed');

      const cached = this.cache.get(index);
      if (cached) return cached;
      const struct = this.image.typeSlice.fromIndex(index);
      const type = this.structToType(struct);
      this.cache.set(index, type);
      return type;
   }

   private structToType(m: BinaryTypeStruct): Type {
      // TODO Add error types

      const { bindTypeNameId, flags, fromModuleInfo, extendedRef, extendedRefs } = m;
      const str = this.image.stringSlice.fromIndex;

      if (fromModuleInfo) {
         const name = str(fromModuleInfo.nameId);
         const version = str(fromModuleInfo.version);
         const mod = BinaryImageLoader.getCachedModule(name, version);

         // We expect module to be resolved because we resolve module dependencies before we call any resolveType
         if (!mod) {
            throw new ReferenceError(
               `resolveType - Tried to resolve type of uncompiled module that was not in dependencies: ${name} ${version}`,
            );
         }

         return new BinaryTypesLoader(this.image, mod).structToType(m);
      }

      if (allOf(flags, TypeBitFlagsU16.IsBindType)) {
         // TODO Resolve bind type
         const name = str(bindTypeNameId!);
         // const type = this.TYPES.get(name);
         // if (type) return type;
         // const dynamicBindType = this.getDynamicType(m.name);
         // if (!dynamicBindType) throw Kernel['ReferenceError::constructor']('resolveType - Unknown bind type: ' + name);
         // return dynamicBindType;
      }

      if (allOf(flags, TypeBitFlagsU16.Boolean)) return booleanType;
      if (allOf(flags, TypeBitFlagsU16.String)) return stringType;
      if (allOf(flags, TypeBitFlagsU16.Closure)) return functionType;
      if (allOf(flags, TypeBitFlagsU16.Undefined)) return voidType;
      if (allOf(flags, TypeBitFlagsU16.Generator)) return generatorObjectType;
      if (allOf(flags, TypeBitFlagsU16.Promise)) return promiseType;
      if (allOf(flags, TypeBitFlagsU16.Map)) return new MapType(this.resolveType(extendedRefs?.[1]));
      if (allOf(flags, TypeBitFlagsU16.Array)) return new ArrayType(this.resolveType(extendedRef));
      if (allOf(flags, TypeBitFlagsU16.Optional)) return new OptionalType(this.resolveType(extendedRef));
      if (allOf(flags, TypeBitFlagsU16.Variant)) return new VariantType(extendedRefs?.map(e => this.resolveType(e)));

      // TODO All bigInts
      if (allOf(flags, TypeBitFlagsU16.BigInt64)) return bigintType;
      if (allOf(flags, TypeBitFlagsU16.IsNumberType) && m.numberRange) {
         return new NumberType(m.numberRange);
      }

      throw new ReferenceError(`resolveType - Unknown type: ${flags}`);
   }
}
