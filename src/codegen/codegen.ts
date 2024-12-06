import ts, { factory } from 'typescript';
import { ClassDefinition } from '../api-builder';

// Just for sake of test
import * as prettier from 'prettier';

import { MetadataConstantDefinition, MetadataModuleDefinition, MetadataPropertyMemberDefinition } from './ScriptModule';
import { TypeScriptAstHelper as t } from './ts-ast-helper';

const CLASS_DEFINITION_NAME = t.i`${ClassDefinition.name}`;
const DEFINTIONS_IDENTITY = t.i`DEFINITIONS`;
const DEFINTIONS_CLASS_ACCESS_IDENTITY = t.i`apiClass`;
const ADD_METHOD_NAME = 'addMethod';
const ADD_PROPERTY_NAME = 'addProperty';
const ADD_STATIC_PROPERTY_NAME = 'addStaticProperty';

export async function generateModule(source: MetadataModuleDefinition, moduleName: string) {
  const definitions: ts.Node[] = [];
  const exportDeclarations: ts.Node[] = [t.importAsFrom(DEFINTIONS_IDENTITY, `./${moduleName}.native.js`)];

  for (const classMeta of source.classes) {
    const name = classMeta.name;
    const nameString = t.v(name);
    const baseClass = classMeta.base_types[0]?.name ? t.v(classMeta.base_types[0].name) : t.v(null);

    let node: ts.Expression = factory.createNewExpression(CLASS_DEFINITION_NAME, undefined, [nameString, baseClass]);

    for (const method of classMeta.functions) {
      if (method.is_constructor) continue;

      node = t.methodCall(
        node,
        ADD_METHOD_NAME,
        [
          t.createFunctionType(
            method.arguments.map(e => [e.name, t.toType(e.type.name)]),
            t.toType(method.return_type.name),
          ),
        ],
        [t.v(method.name)],
      );
    }

    node = addProperties(node, ADD_PROPERTY_NAME, classMeta.properties);
    node = addProperties(node, ADD_STATIC_PROPERTY_NAME, classMeta.constants);

    definitions.push(t.exportConst(name, node));
    exportDeclarations.push(
      t.exportConst(name, t.accessBy(t.accessBy(DEFINTIONS_IDENTITY, name), DEFINTIONS_CLASS_ACCESS_IDENTITY)),
    );
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
        [t.toType(property.type.name)],
        [t.v(property.name), t.v(property.is_read_only)],
      );
    }
    return node;
  }

  // Create a printer to print the AST back to a string
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

  async function writeCode(body: ts.Node[]) {
    // Emit the JavaScript code
    const resultCode = printer.printList(
      ts.ListFormat.AllowTrailingComma,
      body as unknown as ts.NodeArray<ts.Node>,
      ts.createSourceFile('', '', ts.ScriptTarget.Latest),
    );

    // Prettify code
    return await prettier.format(resultCode, { parser: 'acorn', printWidth: 120 });
  }

  const definitionsCode = await writeCode(definitions);
  const exportsCode = await writeCode(exportDeclarations);

  return { definitionsCode, exportsCode };
}
