import { ESLintUtils } from '@typescript-eslint/utils';
const kernel = 'Kernel';
const kernelArrayConstruct = 'KernelArray.Construct';
/** @param {string} globalName */
const kernelAccess = globalName => `${kernel}['globalThis::${globalName}']`;

const noGlobals = ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         useKernel: `Standalone global {{args}} is not allowed as globalThis could be modified anytime, use Kernel access`
      },
      schema: [],
   },
   create(context) {
      /** @param {string} name */
      function isRestricted(name) {
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

      /** @import {TSESTree} from "@typescript-eslint/utils" */

      /** @param {TSESTree.Identifier | TSESTree.JSXIdentifier} node */
      function reportReference(node) {
         if (node.parent.type.startsWith('TS')) return;

         const name = node.name;
         const replaceWith = kernelAccess(name);

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

const noDefaultClasses = ESLintUtils.RuleCreator.withoutDocs({
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

const noArrayExpression = ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         arrayExpression: `Array expression is not permitted, vanilla arrays has unsafe prototype!`
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
               fix: (fixer) => [fixer.replaceText(node, `${kernelArrayConstruct}(${node.elements.map(map.get.bind(map)).map((e) => e.getText()).join(", ")})`)]
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

const noUnsafeIterators = ESLintUtils.RuleCreator.withoutDocs({
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
      function checkNode(node) {
         if (!node) return;
         const tsNode = map.get(node);
         const type = checker.getTypeAtLocation(tsNode);
         if (type.symbol?.name !== "KernelIterator")
            context.report({ messageId: 'unsafeIterator', node: node, });
      }
      return {
         YieldExpression(node) {
            if (!node.delegate) return;
            checkNode(node.argument);
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
         ArrayPattern(node) {/*
            context.report({
               messageId: 'unsafeIterator',
               node: node,
               fix: (fixer) => { fixer.replaceText(node, `KernelArray.From(${node.elements.map(map.get.bind(map)).map((e) => e.getText()).join(", ")})`) }
            });*/
            if (node.parent.type === 'VariableDeclarator') {
               checkNode(node.parent.init);


               /*
               if (!node.parent.init) return;*/               /*
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

/** @param {import('@typescript-eslint/utils').TSESTree.Node} node */
function getRange(node) {
   const [start, end] = node.range;
   return { start, end };
}

const name = '@bedrock-apis/virtual-apis/eslint-plugin';

export const plugin = {
   rules: {
      'no-globals': noGlobals,
      'no-default-extends': noDefaultClasses,
      'no-iterators': noUnsafeIterators,
      'no-array-expression': noArrayExpression
   },
};

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config} */
export const recommended = {
   plugins: {
      [name]: plugin,
   },
   rules: {
      [`${name}/no-globals`]: 'error',
      [`${name}/no-default-extends`]: 'error',
      [`${name}/no-iterators`]: 'error',
   },
};

export default { recommended, plugin };
