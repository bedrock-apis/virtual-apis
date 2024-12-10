import ts, { factory } from 'typescript';
import { ClassDefinition, ParamsDefinition } from '../api-builder';

// Just for sake of test
import * as prettier from 'prettier';

import { Context } from '../api-builder/context';
import { InterfaceBindType } from '../api-builder/type-validators/types/interface';
import {
   MetadataClassDefinition,
   MetadataConstantDefinition,
   MetadataFunctionArgumentDefinition,
   MetadataInterfaceDefinition,
   MetadataModuleDefinition,
   MetadataPropertyMemberDefinition,
   MetadataType,
} from './script-module-metadata';
import { TYPESCRIPT_AST_HELPER as t } from './typescript-ast-helper';

const classDefinitionI = t.i`${ClassDefinition.name}`;
const classDefinitionIApi = 'api' satisfies keyof ClassDefinition;
const classDefinitionIAddMethod = 'addMethod' satisfies keyof ClassDefinition;
const classDefinitonAddProperty = 'addProperty' satisfies keyof ClassDefinition;
const classDefinitonAddStaticProperty = 'addStaticConstant' satisfies keyof ClassDefinition;
const classDefinitonIAddStaticMethod = 'addStaticFunction' satisfies keyof ClassDefinition;

const interfaceBindTypeI = t.i`${InterfaceBindType.name}`;
const interfaceBindTypeIAddProperty = 'addProperty' satisfies keyof InterfaceBindType;

const contextI = t.i`CONTEXT`;
const contextIRegisterType = t.accessBy(contextI, 'registerType' satisfies keyof Context);
const contextIResolveType = 'resolveType' satisfies keyof Context;
function createContextResolveType(type: MetadataType) {
   return t.methodCall(contextI, contextIResolveType, [t.asIs(type)]);
}

const paramsDefinitionI = t.i`${ParamsDefinition.name}`;

export async function generateModule(source: MetadataModuleDefinition, apiFilename: string, useFormatting = true) {
   const moduleName = source.name.split('/')[1] ?? 'unknown';
   const definitionsI = t.i`__`;
   const definitions: ts.Node[] = [
      t.importStarFrom('../' + apiFilename, [classDefinitionI, interfaceBindTypeI, paramsDefinitionI, contextI]),
   ];
   const exportDeclarations: ts.Node[] = [t.importAsFrom(definitionsI, `./${moduleName}.native.js`)];

   for (const interfaceMetadata of source.interfaces) {
      const node = generateInterfaceDefinition(interfaceMetadata);
      definitions.push(t.call(contextIRegisterType, [node]));
   }

   for (const classMeta of source.classes) {
      const name = classMeta.name;
      const node = generateClassDefinition(classMeta);

      definitions.push(t.exportConst(name, node));
      exportDeclarations.push(t.exportConst(name, t.accessBy(t.accessBy(definitionsI, name), classDefinitionIApi)));
   }

   if (source.enums)
      for (const enumMeta of source.enums) {
         exportDeclarations.push(
            t.createEnum(
               enumMeta.name,
               enumMeta.constants.map(e => [e.name, t.asIs(e.value)]),
            ),
         );
      }

   // Create a printer to print the AST back to a string
   const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

   async function writeCode(body: ts.Node[]) {
      // Emit the JavaScript code
      const resultCode = printer.printList(
         ts.ListFormat.AllowTrailingComma |
            ts.ListFormat.MultiLine |
            ts.ListFormat.MultiLineBlockStatements |
            ts.ListFormat.Indented,
         body as unknown as ts.NodeArray<ts.Node>,
         ts.createSourceFile('file.js', '', ts.ScriptTarget.ES2020, false, ts.ScriptKind.JS),
      );

      // Prettify code
      return useFormatting ? await prettier.format(resultCode, { parser: 'acorn', printWidth: 120 }) : resultCode;
   }

   const definitionsCode = await writeCode(definitions);
   const exportsCode = await writeCode(exportDeclarations);

   return { definitionsCode, exportsCode };
}

function generateClassDefinition(classMeta: MetadataClassDefinition) {
   const classId = classMeta.name;
   const classIdI = t.asIs(classId);
   const parent = classMeta.base_types[0]?.name ? t.i`${classMeta.base_types[0].name}` : t.null;

   function getArgTypes(args: MetadataFunctionArgumentDefinition[]) {
      return t.asIs(args.map(e => ({ ...e, type: e.type })));
   }

   const constructorType = classMeta.functions.find(e => e.is_constructor);
   const constructorArgs = constructorType ? getArgTypes(constructorType.arguments) : t.null;

   let node: ts.Expression = factory.createNewExpression(classDefinitionI, undefined, [
      /* context */ contextI,
      /* classId */ classIdI,
      /* parent */ parent,
      /* constructorParams */ constructorArgs,
      /* hasConstructor */ t.asIs(!!constructorType),
      /* newExpected */ t.asIs(true),
   ]);

   for (const { name, return_type, is_static, arguments: args, is_constructor } of classMeta.functions) {
      if (is_constructor) continue;

      node = t.methodCall(node, is_static ? classDefinitonIAddStaticMethod : classDefinitionIAddMethod, [
         t.asIs(name),
         t.createNewCall(paramsDefinitionI, [contextI, getArgTypes(args)]),
         createContextResolveType(return_type),
      ]);
   }

   node = addPropertiesToClass(node, classDefinitonAddProperty, classMeta.properties);
   node = addPropertiesToClass(node, classDefinitonAddStaticProperty, classMeta.constants);

   return node;
}

function addPropertiesToClass(
   node: ts.Expression,
   methodName: string,
   properties: MetadataPropertyMemberDefinition[] | MetadataConstantDefinition[],
) {
   for (const property of properties) {
      node = t.methodCall(
         node,
         methodName,
         [
            t.asIs(property.name),
            t.asIs(property.type),
            t.asIs(property.is_read_only),
            'value' in property ? t.asIs(property.value) : undefined,
         ].filter(e => !!e),
      );
   }
   return node;
}

function generateInterfaceDefinition(interfaceMetadata: MetadataInterfaceDefinition) {
   const name = interfaceMetadata.name;

   let node: ts.Expression = t.createNewCall(interfaceBindTypeI, [t.asIs(name)]);

   for (const { name, type } of interfaceMetadata.properties) {
      node = t.methodCall(node, interfaceBindTypeIAddProperty, [t.asIs(name), createContextResolveType(type)]);
   }

   return node;
}
