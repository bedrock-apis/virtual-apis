// import * as ACORN from 'acorn'
import ts, { factory } from 'typescript';
import fs from 'fs';

// TODO Maybe migrate to acorn if suitable
console.log('abc')
// export type MapToPrintableNode<T> = {
//   [K in keyof T]: T[K] extends ACORN.Node
//     ? Node<PrintableNode<T[K]>>
//     : T[K] extends ACORN.Node[]
//       ? Node<PrintableNode<T[K][number]>>[]
//       : T[K]
// }

// export type PrintableNode<N extends ACORN.Node> = Omit<N,
//   'loc' | 'start' | 'end' | 'range'
// >

// export abstract class Node<N extends { type: string }> {
//   public constructor(public type: N['type']) {}

//   public toCallExpression() {
//     return new CallExpression(this)
//   }
// }

// export class CallExpression
//   extends Node<ACORN.CallExpression>
//   implements PrintableNode<MapToPrintableNode<ACORN.CallExpression>>
// {
//   public constructor(
//     public callee: Node<PrintableNode<ACORN.Expression | ACORN.Super>>,
//   ) {
//     super('CallExpression')
//   }

//   arguments: Node<PrintableNode<ACORN.Expression | ACORN.SpreadElement>>[] = []
//   public optional: boolean = false
// }


export const CodeBuilder = {
  call(identity: ts.Expression, ...params: ts.Expression[]) {
    return factory.createCallExpression(
      identity,
      undefined,
      params
    );
  },
  assign(l: ts.Expression, r: ts.Expression) {
    return factory.createBinaryExpression(l, factory.createToken(ts.SyntaxKind.EqualsToken), r);
  },
  accessWith(origin: ts.Expression, p: string) {
    return factory.createElementAccessExpression(
      origin,
      factory.createStringLiteral(p)
    );
  },
  accessBy(origin: ts.Expression, by: string | ts.Identifier) {
    return factory.createPropertyAccessExpression(
      origin,
      by
    );
  },
  createIdentifier(v: string) { return factory.createIdentifier(v); },
  createModuleConstant(identity: string | ts.BindingName, value: ts.Expression) {
    return factory.createVariableStatement(
      [factory.createToken(ts.SyntaxKind.ExportKeyword)],
      factory.createVariableDeclarationList(
        [factory.createVariableDeclaration(
          identity,
          undefined,
          undefined,
          value
        )],
        ts.NodeFlags.Const
      )
    );
  },
  createEmptyObject() {
    return factory.createObjectLiteralExpression([], false);
  },
  importAsFrom(identity: ts.Identifier, src: string) {
    return factory.createImportDeclaration(
      undefined,
      factory.createImportClause(
        false,
        undefined,
        factory.createNamespaceImport(identity)
      ),
      factory.createStringLiteral(src),
      undefined
    );
  }
}

const data: typeof import("./server_1.15.0-beta.json") = JSON.parse(fs.readFileSync("./src/codegen/server_1.15.0-beta.json").toString());
const OVERTAKES_NAME = "OVERTAKES";
const OVERTAKES_SRC = `
export function ${OVERTAKES_NAME}(prototype, src) {
    const CLONE = Object.create(Object.getPrototypeOf(prototype), Object.getOwnPropertyDescriptors(prototype));
    Object.setPrototypeOf(src, CLONE);
    Object.defineProperties(prototype, Object.getOwnPropertyDescriptors(src));
    return CLONE;
}
`;

const
  PROTOTYPE_ORIGIN_IDENTITY = i`PROTOTYPE_ORIGIN`,
  OVERTAKES_IDENTITY = i`${OVERTAKES_NAME}`,
  MODULE_NAME_IDENTITY = i`MC`,
  SUPER_EXPRESSION = factory.createSuper(),
  CALL_ARGUMENTS_INHERIT = [factory.createSpreadElement(factory.createIdentifier("arguments"))],
  SET_PROTOTYPE_OF = i`__SET_PROTOTYPE_OF`,
  PRESERVED_NAME = i`_`;

const OVERTAKES_AST_NODES = ts.createSourceFile("overtakes.js", OVERTAKES_SRC, ts.ScriptTarget.Latest);


const overtakes = data.classes.map((data) => {
  const METHODS_FILTERED = data.functions.filter(e => e.return_type.name === "Vector3");
  const GETTERS_FILTERED = data.properties.filter(e => e.type.name === "Vector3");
  if ((METHODS_FILTERED.length + GETTERS_FILTERED.length) <= 0) return null;

  const SAVE_CODEBLOCK = CodeBuilder.accessWith(PROTOTYPE_ORIGIN_IDENTITY, data.name);
  const METHODS = METHODS_FILTERED.map(e => {
    const METHOD_IDENTITY = factory.createIdentifier(e.name);
    return factory.createMethodDeclaration(
      undefined,
      undefined,
      METHOD_IDENTITY,
      undefined,
      undefined,
      [],
      undefined,
      factory.createBlock(
        [factory.createReturnStatement(CodeBuilder.call(SET_PROTOTYPE_OF, factory.createCallExpression(
          factory.createPropertyAccessExpression(
            SUPER_EXPRESSION,
            METHOD_IDENTITY
          ),
          undefined,
          CALL_ARGUMENTS_INHERIT
        ), i`VEC3_PROTOTYPE`))],
        false
      )
    );
  });

  const REQUIRED_SETS: ts.SetAccessorDeclaration[] = [];
  const GETTERS = GETTERS_FILTERED.map(e => {
    const METHOD_IDENTITY = factory.createIdentifier(e.name);
    if (!e.is_read_only) {
      REQUIRED_SETS.push(factory.createSetAccessorDeclaration(
        undefined,
        METHOD_IDENTITY,
        [factory.createParameterDeclaration(undefined, undefined, PRESERVED_NAME)],
        factory.createBlock(
          [
            factory.createExpressionStatement(
              factory.createBinaryExpression(
                factory.createPropertyAccessExpression(
                  SUPER_EXPRESSION,
                  METHOD_IDENTITY
                ),
                factory.createToken(ts.SyntaxKind.EqualsToken),
                PRESERVED_NAME
              ))
          ],
          false
        )
      ))
    }
    return factory.createGetAccessorDeclaration(
      undefined,
      METHOD_IDENTITY,
      [],
      undefined,
      factory.createBlock(
        [factory.createReturnStatement(
          CodeBuilder.call(SET_PROTOTYPE_OF,
            factory.createPropertyAccessExpression(
              SUPER_EXPRESSION,
              METHOD_IDENTITY
            ),
            i`VEC3_PROTOTYPE`
          ))],
        false
      )
    );
  });
  return factory.createExpressionStatement(
    CodeBuilder.assign(SAVE_CODEBLOCK,
      CodeBuilder.call(OVERTAKES_IDENTITY, CodeBuilder.accessWith(CodeBuilder.accessWith(MODULE_NAME_IDENTITY, data.name), "prototype"), factory.createObjectLiteralExpression([...METHODS, ...GETTERS, ...REQUIRED_SETS], true)))
  );
}).filter(e => e);

const body = [
  CodeBuilder.importAsFrom(MODULE_NAME_IDENTITY, "@minecraft/server"),
  CodeBuilder.createModuleConstant(PROTOTYPE_ORIGIN_IDENTITY, o()),
  CodeBuilder.createModuleConstant(SET_PROTOTYPE_OF, CodeBuilder.accessBy(i`Object`, i`setPrototypeOf`)),
  ...OVERTAKES_AST_NODES.statements,
  ...overtakes
];
console.log("Success");
// Create a printer to print the AST back to a string
const printer = ts.createPrinter({ newLine: ts.NewLineKind.CarriageReturnLineFeed });

// Emit the JavaScript code
const jsCode = printer.printList(ts.ListFormat.AllowTrailingComma | ts.ListFormat.MultiLine, body as unknown as ts.NodeArray<ts.Node>, undefined);

// Write the JavaScript code to a file
fs.writeFileSync('./src/codegen/generatedCode.js', jsCode);

function i(data: TemplateStringsArray, ...params: unknown[]) { return factory.createIdentifier(data.map((e, i) => e + (params[i] ?? "")).join("")); }
function o() { return factory.createObjectLiteralExpression([], false) }