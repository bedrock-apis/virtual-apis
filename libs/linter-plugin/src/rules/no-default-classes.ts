import { ESLintUtils } from '@typescript-eslint/utils';

export default ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         extendsEmpty: `Use Kernel.Empty as parent class for isolation security`,
      },
      schema: [],
   },
   create(context) {
      return {
         ClassDeclaration(node) {
            if (node.superClass === null) {
               context.report({
                  messageId: 'extendsEmpty',
                  node: node,
                  fix: fixer => {
                     return [fixer.insertTextBefore(node.body, ' extends Kernel.Empty')];
                  },
               });
            }
         },
      };
   },
   defaultOptions: [],
});
