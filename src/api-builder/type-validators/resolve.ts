import { MetadataType } from '../../package-builder/script-module-metadata';
import { Context } from '../context';
import { Kernel } from '../kernel';
import { Type, VoidType } from './type';
import { ArrayType } from './types/array';
import { BooleanType } from './types/boolean';
import { FunctionType } from './types/function';
import { BigIntType, NumberType } from './types/number';
import { OptionalType } from './types/optional';
import { StringType } from './types/string';
import { VariantType } from './types/variant';

export function resolveType(context: Context, metadataType: MetadataType): Type {
   const { name } = metadataType;

   if (metadataType.is_bind_type) {
      const bindType = context.getDynamicType(metadataType.name);
      if (!bindType) throw Kernel['ReferenceError::constructor']('resolveType - Unknown bind type: ' + name);
      return bindType;
   }

   switch (name) {
      case 'uint8':
      case 'int8':
      case 'uint16':
      case 'int16':
      case 'uint32':
      case 'int32':
      case 'float':
      case 'double':
         return new NumberType(metadataType.valid_range);
      case 'uint64':
      case 'int64':
         return new BigIntType(metadataType.valid_range as unknown as { min: bigint; max: bigint });
      case 'boolean':
         return new BooleanType();
      case 'string':
         return new StringType();
      case 'closure':
         return new FunctionType();
      case 'variant':
         return new VariantType(metadataType.variant_types.map(e => resolveType(context, e)));
      case 'optional':
         return new OptionalType(resolveType(context, metadataType.optional_type));
      case 'undefined':
         return new VoidType();
      case 'array':
         return new ArrayType(resolveType(context, metadataType.element_type));
      case 'promise':
      case 'generator':
      case 'map':
      case 'this':
      case 'iterator':
      default:
         // TODO: Metadata type
         throw new Kernel['ReferenceError::constructor'](`resolveType - Unknown type: ${name}`);
   }
}
