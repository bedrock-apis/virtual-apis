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
      factory.createVariableDeclarationList([
        factory.createVariableDeclaration(factory.createIdentifier(identifierName), undefined, undefined, value),
      ]),
    );
  },
  createNewCall(identifierName: string, params: ts.Expression[]) {
    return factory.createNewExpression(factory.createIdentifier(identifierName), undefined, params);
  },
};

const data: typeof import('../../data/server_1.15.0-beta.json') = JSON.parse(
  fs.readFileSync('./data/server_1.15.0-beta.json').toString(),
);

const MODULE_NAME_IDENTITY = i`MC`;

const definitions = data.classes.map(data => {
  const name = data.name;
  let node: ts.Node = CodeBuilder.createNewCall('ClassDefention', [
    i`${name}`,
    data.base_types[0]?.name ? i`${data.base_types[0].name}` : factory.createNull(),
  ]);
  return node;
});

const body = [CodeBuilder.importAsFrom(MODULE_NAME_IDENTITY, '@minecraft/server'), ...definitions];

console.log('Success');
// Create a printer to print the AST back to a string
const printer = ts.createPrinter({
  newLine: ts.NewLineKind.CarriageReturnLineFeed,
});

// Emit the JavaScript code
const jsCode = printer.printList(
  ts.ListFormat.AllowTrailingComma | ts.ListFormat.MultiLine,
  body as unknown as ts.NodeArray<ts.Node>,
  null as any,
);

// Write the JavaScript code to a file
fs.writeFileSync('./dist/generatedCode2.js', jsCode);

function i(data: TemplateStringsArray, ...params: unknown[]) {
  return factory.createIdentifier(data.map((e, i) => e + (params[i] ?? '')).join(''));
}
function o() {
  return factory.createObjectLiteralExpression([], false);
}
