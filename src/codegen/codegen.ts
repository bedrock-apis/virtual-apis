import fs from 'node:fs';
import path from 'node:path';
import ts, { factory } from 'typescript';
import { ClassDefinition } from '../api-builder';
import { TypeScriptAstHelper as t } from './ts-ast-helper';

const CLASS_DEFINITION_NAME = t.i`${ClassDefinition.name}`;
const DEFINTION_FILE_NAME = 'definition.js';
const EXPORTS_FILE_NAME = 'exports.js';
const DEFINTIONS_IDENTITY = t.i`DEFINITIONS`;
const DEFINTIONS_CLASS_ACCESS_IDENTITY = t.i`apiClass`;
const ADD_METHOD_NAME = 'addMethod';
const ADD_PROPERTY_NAME = 'addProperty';
const ADD_STATIC_PROPERTY_NAME = 'addStaticProperty';

const source: typeof import('../../data/server_1.15.0-beta.json') = JSON.parse(
  fs.readFileSync('./data/server_1.15.0-beta.json').toString(),
);

const definitions: ts.Node[] = [];
const exportDeclarations: ts.Node[] = [t.importAsFrom(DEFINTIONS_IDENTITY, path.join('./', DEFINTION_FILE_NAME))];

for (const classMeta of source.classes) {
  const name = classMeta.name;
  const nameString = t.v(name);
  const baseClass = classMeta.base_types[0]?.name ? t.i`${classMeta.base_types[0].name}` : factory.createNull();

  let node: ts.Expression = factory.createNewExpression(CLASS_DEFINITION_NAME, undefined, [nameString, baseClass]);

  for (const method of classMeta.functions) {
    if (method.is_constructor) continue;

    node = t.mehodCall(node, ADD_METHOD_NAME, [t.v(method.name)]);
  }

  for (const property of classMeta.properties) {
    node = t.mehodCall(node, ADD_PROPERTY_NAME, [t.v(property.name)]);
  }

  for (const property of classMeta.constants) {
    node = t.mehodCall(node, ADD_STATIC_PROPERTY_NAME, [t.v(property.name)]);
  }

  definitions.push(t.exportConst(name, node));
  exportDeclarations.push(
    t.exportConst(name, t.accessBy(t.accessBy(DEFINTIONS_IDENTITY, name), DEFINTIONS_CLASS_ACCESS_IDENTITY)),
  );
}

// Create a printer to print the AST back to a string
const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

writeCode(DEFINTION_FILE_NAME, definitions);
writeCode(EXPORTS_FILE_NAME, exportDeclarations);

function writeCode(file: string, body: ts.Node[]) {
  // Emit the JavaScript code
  const resultCode = printer.printList(
    ts.ListFormat.AllowTrailingComma | ts.ListFormat.MultiLine | ts.ListFormat.MultiLineBlockStatements,
    body as unknown as ts.NodeArray<ts.Node>,
    ts.createSourceFile('', '', ts.ScriptTarget.Latest),
  );

  // Write the JavaScript code to a file
  fs.writeFileSync(path.join('dist', file), resultCode);
}

console.log('Success');
