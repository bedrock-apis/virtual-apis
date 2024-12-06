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
      undefined, //typeParams,
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
        if (data < 0)
          return factory.createPrefixUnaryExpression(ts.SyntaxKind.MinusToken, factory.createNumericLiteral(-data));
        return factory.createNumericLiteral(data);

      case 'string':
        return factory.createStringLiteral(data);
      case 'object':
        return data ? objectToExpression(data) : factory.createNull();
      case 'undefined':
        return this.i`undefined`;
      case 'bigint':
        return factory.createBigIntLiteral(data + 'n');
      default:
        throw new TypeError(`Unknown type: ${data}`);
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

  /**
   * Emits compiled enum
   * ```
   * var Example = function(Example$1) {
   *	Example$1["a"] = "b";
   *	Example$1["c"] = "e";
   *	return Example$1;
   * }(Example || {});
   * ```
   *
   * @param name
   * @param values
   * @returns
   */
  createEnum(name: string, values: [name: string, value: ts.Expression][]) {
    return factory.createVariableStatement(
      [factory.createToken(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [
          factory.createVariableDeclaration(
            factory.createIdentifier(name),
            undefined,
            undefined,
            factory.createCallExpression(
              factory.createFunctionExpression(
                undefined,
                undefined,
                undefined,
                undefined,
                [
                  factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    factory.createIdentifier(name + '$1'),
                    undefined,
                    undefined,
                    undefined,
                  ),
                ],
                undefined,
                factory.createBlock(
                  [
                    ...values.map(([name, value]) =>
                      factory.createExpressionStatement(
                        factory.createBinaryExpression(
                          factory.createElementAccessExpression(
                            factory.createIdentifier(name + '$1'),
                            factory.createStringLiteral(name),
                          ),
                          factory.createToken(ts.SyntaxKind.EqualsToken),
                          value,
                        ),
                      ),
                    ),
                    factory.createReturnStatement(factory.createIdentifier(name + '$1')),
                  ],
                  true,
                ),
              ),
              undefined,
              [
                factory.createBinaryExpression(
                  factory.createIdentifier('Example'),
                  factory.createToken(ts.SyntaxKind.BarBarToken),
                  factory.createObjectLiteralExpression([], false),
                ),
              ],
            ),
          ),
        ],
        ts.NodeFlags.None,
      ),
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
    case 'variant':
      return ts.SyntaxKind.NumberKeyword;
    case 'boolean':
      return ts.SyntaxKind.BooleanKeyword;
    case 'bigint':
      return ts.SyntaxKind.BigIntKeyword;
    default:
      return undefined;
  }
}

function objectToExpression(object: object) {
  if (Array.isArray(object)) {
    return factory.createArrayLiteralExpression(
      object.map(e => TypeScriptAstHelper.v(e)),
      false,
    );
  }
  return factory.createObjectLiteralExpression(
    Object.entries(object).map(([key, value]) =>
      factory.createPropertyAssignment(factory.createIdentifier(key), TypeScriptAstHelper.v(value)),
    ),
    false,
  );
}
