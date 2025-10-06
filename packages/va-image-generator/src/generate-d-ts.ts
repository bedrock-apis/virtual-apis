import * as MD from '@bedrock-apis/va-types';
import { StrippedMetadataModuleDefinition } from './metadata-provider';
type PrintableIterator = IterableIterator<string | PrintableIterator>;

export class BaseContext {
   public dependencies: { [key: string]: string } = {};
   public index = 0;
   public recursionLevel = 0;
   public space = '  ';

   public getModuleName(dependency: MD.MetadataModuleBaseDefinition) {
      return (
         this.dependencies[dependency.name] ??
         (this.dependencies[dependency.name] =
            '_' + ((++this.index << 4) | ((this.index ^ (this.index * 31)) & 0xf)).toString(16))
      );
   }

   public formatter(formattable: IteratorObject<string>) {
      return formattable.map(data => this.space + data);
   }
}

export function normalizeModuleName(name: string, version: string) {
   return `virtual_declaration_${name.replace('@minecraft/', '')}_v${version.replaceAll('.', '_')}`;
}

export function* printer(data: StrippedMetadataModuleDefinition): Generator<string> {
   for (const p of printModule(data)) {
      if (typeof p === 'string') yield p;
      else yield* printable(p);
      yield '\n';
   }
}

function* printable(iterator: IterableIterator<string | PrintableIterator>): Generator<string> {
   for (const p of iterator) {
      if (typeof p === 'string') yield p;
      else yield* printable(p);
   }
}

function* printModule(data: StrippedMetadataModuleDefinition): Generator<IterableIterator<string> | string> {
   const context = new BaseContext();
   yield* data.dependencies.map(e => printDependency(e, context));

   yield '\n// Enums - ' + (data.enums?.length ?? 0);
   yield* data.enums?.map(e => printEnum(e, context)) ?? [];
   yield '\n// Interfaces - ' + (data.interfaces?.length ?? 0);
   yield* data.interfaces.map(e => printInterface(e, context));
   yield '\n// Classes - ' + (data.classes?.length ?? 0);
   yield* data.classes.map(e => printClass(e, context));
   yield '\n// Constants & Objects - ' + (data.constants.length + data.objects.length);
   yield* data.constants.map(e => printConst(e, context));
   // Just basic line space
   yield '';
   yield* data.objects.map(e => printObject(e, context));
   yield '\n// Functions - ' + data.functions.length;
   yield* data.functions.map(e => printFunction(e, context));
   yield '\n// Errors - ' + data.errors.length;
   yield* data.errors.map(e => printError(e, context));
}

function propertyName(property: string) {
   try {
      eval(`class S { ${property}(){} }`);
      return property;
   } catch (error) {
      console.log('Keyword fix for: ' + property);
      return `'${property}'`;
   }
}

function* printDependency(data: MD.MetadataModuleBaseDefinition, context: BaseContext) {
   yield `import * as ${context.getModuleName(data)} from './${normalizeModuleName(data.name, data.versions!.at(-1)!['version'])}';`;
}

function* printObject(data: MD.MetadataObjectDefinition, context: BaseContext) {
   yield `export ${data.is_read_only ? 'const' : 'let'} ${data.name}: ${typePrinter(data.type, context)};`;
}

function* printConst(data: MD.MetadataConstantDefinition, context: BaseContext) {
   if ('value' in data) yield `export ${data.is_read_only ? 'const' : 'let'} ${data.name} = ${toLiteral(data.value)};`;
   else
      yield `export ${data.is_read_only ? 'const' : 'let'} ${data.name}: ${typePrinter(data.type, context, true, false)};`;
}

function* printInterface(data: MD.MetadataInterfaceDefinition, context: BaseContext) {
   yield `export interface ${data.name} ${(data.base_types?.length ?? 0) > 0 ? `extends ${data.base_types.map(t => typePrinter(t, context, false, false)).join(', ')}` : ''}{ ${data.properties.map(p => interfaceProperty(p, context)).join('; ')}};`;
}

function interfaceProperty(data: MD.MetadataPropertyMemberDefinition, context: BaseContext) {
   if (data.type.name === 'optional') {
      return `${data.is_read_only ? 'readonly ' : ''}${propertyName(data.name)}?: ${typePrinter(data.type.optional_type, context, true, false)}`;
   } else {
      return `${data.is_read_only ? 'readonly ' : ''}${propertyName(data.name)}: ${typePrinter(data.type, context, true, false)}`;
   }
}

function createType(
   object: Partial<Omit<MD.MetadataType, 'name' | 'is_bind_type' | 'is_errorable'>> &
      Pick<MD.MetadataType, 'name' | 'is_bind_type' | 'is_errorable'>,
): MD.MetadataType {
   // @ts-expect-error something that i have no idea
   return object;
}

function* printError(data: MD.MetadataErrorClassDefinition, context: BaseContext) {
   const hadConstructor = false;
   const content = [
      ...data.properties.map(p => classProperty(p, context)),
      ...(hadConstructor ? [] : ['private constructor()']),
   ];
   yield `export class ${data.name} extends Error{ ${content.join('; ') + (content.length > 0 ? ';' : '')}};`;
}

function* printClass(data: MD.MetadataClassDefinition, context: BaseContext) {
   let hadConstructor = false;
   if (data.iterator) {
      data.functions.push({
         arguments: [],
         is_constructor: false,
         is_static: false,
         name: 'next',
         call_privilege: [{ name: 'read_only' }],
         return_type: createType({
            is_bind_type: false,
            is_errorable: data.iterator.is_errorable,
            name: 'iterator',
            iterator_result: data.iterator.optional_type ? data.iterator.optional_type : data.iterator,
         }),
      });
      data.functions.push({
         arguments: [],
         is_constructor: false,
         is_static: false,
         name: '[Symbol.iterator]',
         call_privilege: [{ name: 'read_only' }],
         return_type: createType({
            is_bind_type: false,
            is_errorable: false,
            name: 'this',
         }),
      });
   }
   const content = [
      ...data.constants.map(p => classConstant(p, context)),
      ...data.properties.map(p => classProperty(p, context)),
      ...data.functions.map(p => {
         if (p.is_constructor) hadConstructor = true;
         return classMethod(p, context);
      }),
      ...(hadConstructor ? [] : ['private constructor()']),
   ];
   if ((data.base_types.length ?? 0) > 0)
      yield '//@ts-ignore extending for classes with private constructor is possible with native API\n';
   yield `export class ${data.name} ${(data.base_types?.length ?? 0) > 0 ? `extends ${data.base_types.map(t => typePrinter(t, context, false, false)).join(', ')}` : ''}{ ${
      content.join('; ') + (content.length > 0 ? ';' : '')
   }};`;
}

function classMethod(data: MD.MetadataFunctionDefinition, context: BaseContext) {
   let text = 'public ';
   if (data.is_static) text += 'static ';
   text += `${propertyName(data.name)}(${data.arguments.map(e => printArgument(e, context)).join(', ')})`;

   if (!data.is_constructor) text += ': ' + typePrinter(data.return_type, context, false, true);
   return text;
}

function classProperty(data: MD.MetadataPropertyMemberDefinition, context: BaseContext) {
   let text = 'public ';
   if (data.is_static) text += 'static ';
   if (data.is_read_only) text += 'readonly ';
   text += propertyName(data.name);
   if (data.type.optional_type) text += '?';
   text += ': ' + typePrinter(data.type.optional_type ?? data.type, context, true, false);
   return text;
}

function classConstant(data: MD.MetadataConstantDefinition, context: BaseContext) {
   let text = 'public ';
   if (data.is_static) text += 'static ';
   if (data.is_read_only) text += 'readonly ';
   text +=
      'value' in data
         ? `${propertyName(data.name)} = ${toLiteral(data.value)}`
         : `${propertyName(data.name)}: ${typePrinter(data.type, context, true, false)}`;
   return text;
}

function* printEnum(data: MD.MetadataEnumDefinition, context: BaseContext) {
   const test = `export enum ${data.name} { ${data.constants.map(e => `${propertyName(e.name)} = ${toLiteral(e.value)}`).join(', ')}};`;
   yield test;
}

function* printFunction(data: MD.MetadataFunctionDefinition, context: BaseContext) {
   const test = `export function ${data.name}(${data.arguments.map(a => printArgument(a, context)).join(', ')}): ${typePrinter(data.return_type, context, false, true)}`;
   yield test;
}

function printArgument(data: MD.MetadataFunctionArgumentDefinition, context: BaseContext) {
   return `${data.name}${'default_value' in (data.details ?? {}) ? '?' : ''}: ${typePrinter(data.type.name === 'optional' ? data.type.optional_type : data.type, context, true, false)}`;
}

function typePrinter(data: MD.MetadataType, context: BaseContext, safeContext = true, isReturnType = false): string {
   if (data.is_bind_type) {
      return `{ [handleType]: ${data.from_module ? context.getModuleName(data.from_module) + '.' : ''}${data.name} }`;
   }

   switch (data.name) {
      case 'array':
         return `${data.element_type.name == 'undefined' ? 'never' : typePrinter(data.element_type, context, false, false)}[]`;
      case 'boolean':
         return data.name;
      case 'string':
         return data.name;
      case 'this':
         return data.name;
      case 'undefined':
         return isReturnType ? 'void' : 'undefined';
      case 'generator':
         return `Generator<${typePrinter(data.generator_type.next_type, context)}${
            data.generator_type.return_type.name != 'undefined' || data.generator_type.yield_type.name != 'undefined'
               ? ', ' + typePrinter(data.generator_type.return_type, context, true, true)
               : ''
         }${
            data.generator_type.yield_type.name != 'undefined'
               ? ', ' + typePrinter(data.generator_type.yield_type, context, true, false)
               : ''
         }>`;
      case 'optional':
         return safeContext
            ? `${typePrinter(data.optional_type, context, true, isReturnType)} | undefined`
            : `(${typePrinter(data.optional_type, context, true, isReturnType)} | undefined)`;
      case 'promise':
         return `Promise<${typePrinter(data.promise_type, context, true, isReturnType)}>`;
      case 'iterator':
         return `IteratorResult<${typePrinter(data.iterator_result, context, true, false)}>`;
      case 'variant':
         return safeContext
            ? `${data.variant_types.map(s => typePrinter(s, context, true, isReturnType)).join(' | ')}`
            : `(${data.variant_types.map(s => typePrinter(s, context, true, isReturnType)).join(' | ')})`;
      case 'map':
         return `Record<${typePrinter(data.key_type, context, true, false)},${typePrinter(data.value_type, context, true, false)}>`;
      case 'closure':
         return `(${data.closure_type.argument_types.map((s, i) => `arg${i}${s.optional_type ? `?: ${typePrinter(s.optional_type, context, true, false)}` : `: ${typePrinter(s, context, true, false)}`}`).join(', ')})=>${typePrinter(data.closure_type.return_type, context, false, true)}`;
      case 'uint8':
      case 'uint16':
      case 'uint32':
      case 'uint64':
      case 'int8':
      case 'int16':
      case 'int32':
      case 'int64':
      case 'double':
      case 'float':
         return 'number';
      default:
         return 'unknown';
   }
}

function toLiteral(data: unknown) {
   return typeof data === 'string' ? `${JSON.stringify(data)}` : data;
}

function* printerHelper(
   iterator: IterableIterator<string>,
   next: string,
   onLast: (p: string) => string,
   context: BaseContext,
) {
   for (const v of iterator) {
      yield next;
      next = v;
   }
   yield onLast(next);
}
