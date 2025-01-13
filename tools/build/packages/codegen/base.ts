import ts, { factory } from 'typescript';
import type { ASTIdentifier } from './general';

class ASTNode {
   public constructor(node: ts.Node) {
      return Object.setPrototypeOf(node, new.target.prototype);
   }
   public access(by: ASTIdentifier): NodeType {
      return new ASTNode(
         factory.createPropertyAccessExpression(this as unknown as ts.Expression, by as unknown as ts.Identifier),
      ) as NodeType;
   }
   public construct(params: ts.Node[] = []): NodeType {
      return new ASTNode(
         factory.createNewExpression(this as unknown as ts.Expression, undefined, params as ts.Expression[]),
      ) as NodeType;
   }
   public invoke(params: ts.Node[] = []): NodeType {
      return new ASTNode(
         factory.createCallExpression(this as unknown as ts.Expression, undefined, params as ts.Expression[]),
      ) as NodeType;
   }
   public methodCall(method: ASTIdentifier, params: ts.Node[] = []): NodeType {
      return this.access(method).invoke(params);
   }
}
export type NodeType = ts.Node & ASTNode;

export const NodeConstructor: { new (node: ts.Node): NodeType; readonly prototype: NodeType } = ASTNode as unknown as {
   new (node: ts.Node): NodeType;
   readonly prototype: NodeType;
};

export type TsNode = ts.Node;
