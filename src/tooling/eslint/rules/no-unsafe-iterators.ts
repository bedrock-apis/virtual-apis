import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: false,
      fixable: 'code',
      messages: {
         unsafeIterator: `Using iterators is unsafe as iterators are not isolated`,
         forOfDestructor: `Using destructors in for-of is not permitted.`,
      },
      schema: [],
   },
   create(context) {
      const checker = context.sourceCode.parserServices?.program?.getTypeChecker();
      const map = context.sourceCode.parserServices?.esTreeNodeToTSNodeMap;
      if (!map || !checker) return {};

      const checkNode = (node: TSESTree.Node) => {
         if (!node) return;
         const tsNode = map.get(node);
         const type = checker.getTypeAtLocation(tsNode);
         if (type.symbol?.name !== 'KernelIterator') context.report({ messageId: 'unsafeIterator', node: node });
      };

      return {
         YieldExpression(node) {
            if (!node.delegate) return;
            checkNode(node.argument as TSESTree.Node);
         },
         ForOfStatement(node) {
            // @ts-expect-error TODO Proper type fix
            for (const n of node.left.declarations) {
               if (n.id.type === 'ArrayPattern')
                  context.report({
                     messageId: 'forOfDestructor',
                     node: n.id,
                  });
            }
            checkNode(node.right);
            /*
            if (node.right.type !== 'CallExpression')
               context.report({
                  messageId: 'unsafeIterator',
                  node: node.right,
               });
            // @ts-expect-error TODO Proper type fix
            else if (node.right.callee.object?.name !== 'Kernel')
               context.report({
                  messageId: 'unsafeIterator',
                  node: node.right,
               });*/
         },
         ArrayPattern(node) {
            /*
            context.report({
               messageId: 'unsafeIterator',
               node: node,
               fix: (fixer) => { fixer.replaceText(node, `KernelArray.From(${node.elements.map(map.get.bind(map)).map((e) => e.getText()).join(", ")})`) }
            });*/
            if (node.parent.type === 'VariableDeclarator') {
               checkNode(node.parent.init as TSESTree.Node);

               /*
               if (!node.parent.init) return;*/ /*
               if (node.parent.init.type !== 'CallExpression')
                  context.report({
                     messageId: 'unsafeIterator',
                     node: node.parent.init,
                  });
               // @ts-expect-error TODO Proper type fix
               else if (node.parent.init.callee.object?.name !== 'Kernel')
                  context.report({
                     messageId: 'unsafeIterator',
                     node: node.parent.init,
                  });*/
            }
         },
      };
   },
   defaultOptions: [],
});
