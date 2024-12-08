import ts, { factory } from 'typescript';
import { ClassDefinition } from '../api-builder';

// Just for sake of test
import * as prettier from 'prettier';

import { Type } from '../api-builder/type-validators';
import { InterfaceBindType } from '../api-builder/type-validators/bind-type';
import { toDefaultType } from '../api-builder/type-validators/default-types';
import {
  MetadataClassDefinition,
  MetadataConstantDefinition,
  MetadataInterfaceDefinition,
  MetadataModuleDefinition,
  MetadataPropertyMemberDefinition,
} from './ScriptModule';
import { TypeScriptAstHelper as t } from './ts-ast-helper';

const classDefinitionI = t.i`${ClassDefinition.name}`;
const classDefinitionIApiClassProperty = 'class' satisfies keyof ClassDefinition;
const classDefinitionIAddMethod = 'addMethod' satisfies keyof ClassDefinition;
const classDefinitonAddProperty = 'addProperty' satisfies keyof ClassDefinition;

const interfaceBindTypeI = t.i`${InterfaceBindType.name}`;
const interfaceBindTypeIAddProperty = 'addProperty' satisfies keyof InterfaceBindType;
const registerExpression = t.accessBy(t.i`${Type.name}`, Type.RegisterBindType.name);

export async function generateModule(source: MetadataModuleDefinition, useFormatting = true) {
  const moduleName = source.name.split('/')[1] ?? 'unknown';
  const definitionsI = t.i`__defs`;
  const definitions: ts.Node[] = [];
  const exportDeclarations: ts.Node[] = [t.importAsFrom(definitionsI, `./${moduleName}.native.js`)];

  for (const interfaceMetadata of source.interfaces) {
    const node = GenerateInterface(interfaceMetadata);
    definitions.push(t.call(registerExpression, [node]));
  }

  for (const classMeta of source.classes) {
    const name = classMeta.name;

    const node = GenerateClass(classMeta);

    definitions.push(t.exportConst(name, node));
    exportDeclarations.push(
      t.exportConst(name, t.accessBy(t.accessBy(definitionsI, name), classDefinitionIApiClassProperty)),
    );
  }

  if (source.enums)
    for (const enumMeta of source.enums) {
      exportDeclarations.push(
        t.createEnum(
          enumMeta.name,
          enumMeta.constants.filter(e => !!e.name && !!e.value).map(e => [e.name, t.v(e.value)]),
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

function addProperties(
  node: ts.Expression,
  methodName: string,
  properties: MetadataPropertyMemberDefinition[] | MetadataConstantDefinition[],
) {
  for (const property of properties) {
    node = t.methodCall(
      node,
      methodName,
      [
        t.v(property.name),
        t.v(toDefaultType(property.type)),
        t.v(property.is_read_only),
        'value' in property ? t.v(property.value) : undefined,
      ].filter(e => !!e),
    );
  }
  return node;
}

function GenerateClass(classMeta: MetadataClassDefinition) {
  const name = classMeta.name;
  const nameString = t.v(name);
  const baseClass = classMeta.base_types[0]?.name ? t.v(classMeta.base_types[0].name) : t.v(null);

  let node: ts.Expression = factory.createNewExpression(classDefinitionI, undefined, [nameString, baseClass]);

  for (const method of classMeta.functions) {
    const paramTypes = t.v(method.arguments.map(e => ({ ...e, type: toDefaultType(e.type) })));

    if (method.is_constructor) {
      console.log('SKIPPED CONSTRUCTOR for ', classMeta.name);
    } else {
      node = t.methodCall(node, classDefinitionIAddMethod, [
        t.v(method.name),
        paramTypes,
        t.v(toDefaultType(method.return_type)),
      ]);
    }
  }

  node = addProperties(node, classDefinitonAddProperty, classMeta.properties);
  node = addProperties(node, classDefinitonAddProperty, classMeta.constants);

  return node;
}

function GenerateInterface(interfaceMetadata: MetadataInterfaceDefinition) {
  const name = interfaceMetadata.name;

  let node: ts.Expression = factory.createNewExpression(interfaceBindTypeI, undefined, [t.v(name)]);

  for (const { is_read_only, is_static, name, type } of interfaceMetadata.properties) {
    node = t.methodCall(node, interfaceBindTypeIAddProperty, [t.v(name), t.v(type.name), t.v('optional_type' in type)]);
  }

  return node;
}
