import fs from 'node:fs';
import ts, { factory } from 'typescript';

export const CodeBuilder = {
  call(identity: ts.Expression, ...params: ts.Expression[]) {
    return factory.createCallExpression(identity, undefined, params);
  },
  assign(l: ts.Expression, r: ts.Expression) {
    return factory.createBinaryExpression(l, factory.createToken(ts.SyntaxKind.EqualsToken), r);
  },
  accessWith(origin: ts.Expression, p: string) {
    return factory.createElementAccessExpression(origin, factory.createStringLiteral(p));
  },
  accessBy(origin: ts.Expression, by: string | ts.Identifier) {
    return factory.createPropertyAccessExpression(origin, by);
  },
  createIdentifier(v: string) {
    return factory.createIdentifier(v);
  },
  createModuleConstant(identity: string | ts.BindingName, value: ts.Expression) {
    return factory.createVariableStatement(
      [factory.createToken(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(identity, undefined, undefined, value)],
        ts.NodeFlags.Const,
      ),
    );
  },
  createEmptyObject() {
    return factory.createObjectLiteralExpression([], false);
  },
  importAsFrom(identity: ts.Identifier, src: string) {
    return factory.createImportDeclaration(
      undefined,
      factory.createImportClause(false, undefined, factory.createNamespaceImport(identity)),
      factory.createStringLiteral(src),
      undefined,
    );
  },
  createExportConst(identifierName: string, value: ts.Expression) {
    return factory.createVariableStatement(
      [factory.createToken(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(factory.createIdentifier(identifierName), undefined, undefined, value)],
        ts.NodeFlags.Const,
      ),
    );
  },
  createNewCall(identifierName: string, params: ts.Expression[]) {
    return factory.createNewExpression(factory.createIdentifier(identifierName), undefined, params);
  },
  builderCall(nodeToBeCalled: ts.Expression, methodName: string, params: ts.Expression[]) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(nodeToBeCalled, factory.createIdentifier(methodName)),
      undefined,
      params,
    );
  },
  string(string: string) {
    return factory.createStringLiteral(string);
  },
};

const data: typeof import('../../data/server_1.15.0-beta.json') = JSON.parse(
  fs.readFileSync('./data/server_1.15.0-beta.json').toString(),
);

const MODULE_NAME_IDENTITY = i`MC`;

const definitions = data.classes.map(data => {
  const name = data.name;
  const nameString = CodeBuilder.string(name);
  const nameDefinition = `${name}Definition`;
  const baseClass = data.base_types[0]?.name ? i`${data.base_types[0].name}` : factory.createNull();

  let node: ts.Expression = CodeBuilder.createNewCall('ClassDefintion', [nameString, baseClass]);

  for (const method of data.functions) {
    if (method.is_constructor) continue;

    node = CodeBuilder.builderCall(node, 'addMethod', [CodeBuilder.string(method.name)]);
  }

  return [
    CodeBuilder.createExportConst(nameDefinition, node),

    CodeBuilder.createExportConst(name, factory.createPropertyAccessExpression(i`${nameDefinition}`, i`apiClass`)),
  ];
});

const body: ts.Node[] = [CodeBuilder.importAsFrom(MODULE_NAME_IDENTITY, '@minecraft/server'), ...definitions.flat()];

// Create a printer to print the AST back to a string
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.CarriageReturnLineFeed,
});

// Emit the JavaScript code
const resultCode = printer.printList(
  ts.ListFormat.AllowTrailingComma | ts.ListFormat.MultiLine | ts.ListFormat.MultiLineBlockStatements,
  body as unknown as ts.NodeArray<ts.Node>,
  ts.createSourceFile('', '', ts.ScriptTarget.Latest),
);

// Write the JavaScript code to a file
fs.writeFileSync('./dist/generatedCode.js', resultCode);

function i(data: TemplateStringsArray, ...params: unknown[]) {
  return factory.createIdentifier(data.map((e, i) => e + (params[i] ?? '')).join(''));
}

console.log('Success');
