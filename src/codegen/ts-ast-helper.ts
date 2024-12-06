import ts, { factory } from 'typescript';

export const TypeScriptAstHelper = {
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
  exportConst(identifierName: string, value: ts.Expression) {
    return factory.createVariableStatement(
      [factory.createToken(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(factory.createIdentifier(identifierName), undefined, undefined, value)],
        ts.NodeFlags.Const,
      ),
    );
  },
  createNewCall(identifier: ts.Identifier, params: ts.Expression[]) {
    return factory.createNewExpression(identifier, undefined, params);
  },
  mehodCall(nodeToBeCalled: ts.Expression, methodName: string, params: ts.Expression[]) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(nodeToBeCalled, factory.createIdentifier(methodName)),
      undefined,
      params,
    );
  },
  i(name: TemplateStringsArray, ...params: unknown[]) {
    return factory.createIdentifier(name.map((e, i) => e + (params[i] ?? '')).join(''));
  },
  v(data: unknown): ts.Expression {
    switch (typeof data) {
      case 'boolean':
        return data ? factory.createTrue() : factory.createFalse();
      case 'number':
        return factory.createNumericLiteral(data);
      case 'string':
        return factory.createStringLiteral(data);
      case 'object':
        return data ? o() : factory.createNull();
      case 'undefined':
        return this.i`undefined`;
      case 'bigint':
        return factory.createBigIntLiteral(data + 'n');
      default:
        throw new TypeError('Unknown type');
    }
  },
};

function o() {
  return factory.createObjectLiteralExpression([], false);
}
