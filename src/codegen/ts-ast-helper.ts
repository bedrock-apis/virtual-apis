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
  methodCall(
    nodeToBeCalled: ts.Expression,
    methodName: string,
    typeParams: ts.TypeNode[] | undefined,
    params: ts.Expression[],
  ) {
    return factory.createCallExpression(
      factory.createPropertyAccessExpression(nodeToBeCalled, factory.createIdentifier(methodName)),
      typeParams,
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
  createFunctionType(params: [name: string, type: ts.TypeNode][], returnType: ts.TypeNode) {
    return factory.createFunctionTypeNode(
      undefined,
      params.map(([name, type]) =>
        factory.createParameterDeclaration(
          undefined,
          undefined,
          factory.createIdentifier(name),
          undefined,
          type,
          undefined,
        ),
      ),
      returnType,
    );
  },

  toType(string: string) {
    const keywordType = toKeywordType(string);
    return keywordType
      ? factory.createKeywordTypeNode(keywordType)
      : factory.createTypeReferenceNode(factory.createIdentifier(string), undefined);
  },
};

function toKeywordType(string: string) {
  switch (string) {
    case 'string':
      return ts.SyntaxKind.StringKeyword;
    case 'number':
    case 'int32':
    case 'varint':
      return ts.SyntaxKind.NumberKeyword;
    case 'boolean':
      return ts.SyntaxKind.BooleanKeyword;
    case 'bigint':
      return ts.SyntaxKind.BigIntKeyword;
    default:
      return undefined;
  }
}

function o() {
  return factory.createObjectLiteralExpression([], false);
}
