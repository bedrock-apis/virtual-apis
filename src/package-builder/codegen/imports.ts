/* eslint-disable @typescript-eslint/no-explicit-any */
import ts, { factory } from 'typescript';
import { NodeConstructor, NodeType } from './base';
import { ASTIdentifier, ValueLiteral } from './general';

export abstract class ASTImport extends NodeConstructor {
   public constructor(type: ts.NamedImports | ts.NamespaceImport, moduleSpecifier: string | ValueLiteral) {
      super(
         factory.createImportDeclaration(
            undefined,
            factory.createImportClause(false, undefined, type),
            ValueLiteral.GetValue(moduleSpecifier) as unknown as ts.StringLiteral,
            undefined,
         ),
      );
   }
   public abstract import(identifier: ASTIdentifier): NodeType;
}
export class ASTNamedImport extends ASTImport {
   public constructor(moduleSpecifier: string | ValueLiteral) {
      super(factory.createNamedImports([]), moduleSpecifier);
   }
   public import(identifier: ASTIdentifier, as?: ASTIdentifier): NodeType {
      const elements = (this as any).importClause?.namedBindings?.elements;
      const importSpecifier = factory.createImportSpecifier(
         false,
         (as ? identifier : undefined) as any,
         as ? as : (identifier as any),
      );
      elements.push(importSpecifier);
      return as ?? identifier;
   }
}
export class ASTNamespaceImport extends ASTImport {
   private __identifier;
   public constructor(identifier: ASTIdentifier, moduleSpecifier: string | ValueLiteral) {
      super(factory.createNamespaceImport(identifier as any), moduleSpecifier);
      this.__identifier = identifier;
   }
   public import(identifier: ASTIdentifier): NodeType {
      return this.__identifier.access(identifier);
   }
}
