import { isDeepStrictEqual } from 'node:util';
import { MetadataType } from '@helper/script-module-metadata';

const DEFAULT_TYPES = [
   {
      is_bind_type: false,
      is_errorable: false,
      name: 'int32',
      valid_range: {
         max: 2147483647,
         min: -2147483648,
      },
   },
   {
      is_bind_type: false,
      is_errorable: false,
      name: 'uint32',
      valid_range: {
         max: 2147483647,
         min: -2147483648,
      },
   },
   {
      is_bind_type: false,
      is_errorable: false,
      name: 'string',
   },
   {
      is_bind_type: false,
      is_errorable: false,
      name: 'boolean',
   },
] as const;

export function isDefaultType(type: MetadataType) {
   return DEFAULT_TYPES.find(e => isDeepStrictEqual(e, type));
}

export function toDefaultType(type: MetadataType) {
   if (isDefaultType(type)) return type.name;
   return type;
}

export function fromDefaultType(type: (typeof DEFAULT_TYPES)[number]['name'] | MetadataType) {
   return typeof type === 'string' ? (DEFAULT_TYPES.find(e => e.name === type) as MetadataType) : type;
}

export type DefaultMetadataType = (typeof DEFAULT_TYPES)[number]['name'] | MetadataType;
