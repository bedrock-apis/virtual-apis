import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

const kernel = 'Kernel';
export const kernelAccess = (globalName: string, accessContext = 'globalThis') =>
   `${kernel}['${accessContext}::${globalName}']`;

export default ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         useKernel: `Standalone global {{args}} is not allowed as globalThis could be modified anytime, use Kernel access`,
      },
      schema: [],
   },
   create(context) {
      function isRestricted(name: string) {
         if (name === 'undefined') return false;

         return name in globalThis;
      }

      const sourceCode = context.sourceCode;
      return {
         Program(node) {
            const scope = sourceCode.getScope(node);

            // Report variables declared elsewhere (ex: variables defined as "global" by eslint)
            scope.variables.forEach(variable => {
               if (!variable.defs.length && isRestricted(variable.name)) {
                  variable.references.forEach(variable => reportReference(variable.identifier));
               }
            });

            // Report variables not declared at all
            scope.through.forEach(reference => {
               if (isRestricted(reference.identifier.name)) {
                  if (reference.isTypeReference) return;
                  reportReference(reference.identifier);
               }
            });
         },
      };

      function reportReference(node: TSESTree.Identifier | TSESTree.JSXIdentifier) {
         if (node.parent.type.startsWith('TS')) return;

         const name = node.name;
         const accessType = node.parent.type === 'MemberExpression' ? 'static' : 'globalThis';
         const replaceWith = kernelAccess(name, accessType);

         context.report({
            node: node,
            messageId: 'useKernel',
            data: { args: name },
            fix(fixer) {
               return [fixer.replaceTextRange(node.range, replaceWith)];
            },
         });
      }
   },
   defaultOptions: [],
});
