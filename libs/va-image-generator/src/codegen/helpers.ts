import ts, { factory } from 'typescript';
import { NodeConstructor, NodeType, TsNode } from './base';
import { ASTIdentifier } from './general';

export class ASTHelper {
   public static VariableExport(identifier: ASTIdentifier, node: TsNode): NodeType {
      return new NodeConstructor(
         factory.createVariableStatement(
            [factory.createToken(ts.SyntaxKind.ExportKeyword)],
            factory.createVariableDeclarationList(
               [
                  factory.createVariableDeclaration(
                     identifier as unknown as string,
                     undefined,
                     undefined,
                     node as ts.Expression,
                  ),
               ],
               ts.NodeFlags.Const,
            ),
         ),
      );
   }
}
