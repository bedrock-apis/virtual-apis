import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import { kernelArrayConstruct } from '../plugin';

export default ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         arrayExpression: `Array expression is not permitted, vanilla arrays has unsafe prototype!`,
      },
      schema: [],
   },
   create(context) {
      const sourceCode = context.sourceCode;
      const checker = sourceCode.parserServices?.program?.getTypeChecker();
      const map = sourceCode.parserServices?.esTreeNodeToTSNodeMap;
      if (!map || !checker) return {};

      return {
         ArrayExpression(node) {
            if (
               node.parent.type === 'TSAsExpression' &&
               node.parent.typeAnnotation.type === 'TSTypeReference' &&
               node.parent.typeAnnotation.typeName.type === 'Identifier' &&
               node.parent.typeAnnotation.typeName.name === 'const'
            )
               return; // ignore const a = [] as const because array will be not modified;

            if (node.type.startsWith('TS')) return;
            context.report({
               messageId: 'arrayExpression',
               node: node,
               fix: fixer => [
                  fixer.replaceText(
                     node,
                     `${kernelArrayConstruct}(${node.elements
                        .map(e => map.get(e as TSESTree.Node))
                        .map(e => e.getText())
                        .join(', ')})`,
                  ),
               ],
            });

            /*
           const range = getRange(node);
           const args = source.substring(range.start + 1, range.end - 1);
           const replaceWith = `${kernelArrayFrom}(${args})`;

           context.report({
              node,
              messageId: 'useKernel',
              data: { args: replaceWith },
              fix(fixer) {
                 return [fixer.replaceTextRange([range.start, range.end], replaceWith)];
              },
           });*/
         },
      };
   },
   defaultOptions: [],
});
