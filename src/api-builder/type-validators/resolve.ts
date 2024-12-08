import { MetadataType } from '../../package-builder/ScriptModule';
import { Kernel } from '../kernel';
import { BooleanType } from './boolean-type';
import { FunctionType } from './function-type';
import { BigIntType, NumberType } from './number-type';
import { StringType } from './string-type';
import { Type, VoidType } from './type';

export function resolveType(metadataType: MetadataType) {
  const { name } = metadataType;

  if (metadataType.is_bind_type) {
    const bindType = Type.boundTypes.get(name);
    if (!bindType) throw Kernel['ReferenceError::constructor']('Unknown bind type: ' + name);
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
      return new BigIntType(metadataType.valid_range);
    case 'boolean':
      return new BooleanType();
    case 'string':
      return new StringType();
    case 'closure':
      return new FunctionType();
    case 'undefined':
      return new VoidType();
    default:
      // TODO: Metadata type
      throw new Kernel['ReferenceError::constructor'](`BaseType::resolve - UnknownType: ${name}`);
  }
}
