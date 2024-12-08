import { MetadataType } from '../../package-builder/script-module-metadata';
import { Kernel } from '../kernel';
import { Type, VoidType } from './type';
import { BooleanType } from './types/boolean';
import { FunctionType } from './types/function';
import { BigIntType, NumberType } from './types/number';
import { OptionalType } from './types/optional';
import { StringType } from './types/string';

export function resolveType(metadataType: MetadataType): Type {
   const { name } = metadataType;

   if (metadataType.is_bind_type) {
      const bindType = Type.bindedTypes.get(name);
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
      case 'optional':
         return new OptionalType(resolveType(metadataType.optional_type));
      case 'undefined':
         return new VoidType();
      default:
         // TODO: Metadata type
         throw new Kernel['ReferenceError::constructor'](`resolveType - Unknown type: ${name}`);
   }
}
