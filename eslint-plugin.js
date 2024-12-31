import { ESLintUtils } from '@typescript-eslint/utils';

const kernel = 'Kernel';
/** @param {string} globalName */
const kernelAccess = globalName => `${kernel}['globalThis::${globalName}']`;
const kernelConstruct = kernel + '.Construct';

const noGlobals = ESLintUtils.RuleCreator.withoutDocs({
   meta: {
      type: 'problem',
      hasSuggestions: true,
      fixable: 'code',
      messages: {
         useKernel: `Use {{ args }} instead`,
      },
      schema: [],
   },
   create(context) {
      /** @param {string} name */
      function isRestricted(name) {
         if (name === 'undefined') return false;

         return name in globalThis;
      }

      const source = context.sourceCode.text;
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
         ArrayExpression(node) {
            if (
               node.parent.type === 'TSAsExpression' &&
               node.parent.typeAnnotation.type === 'TSTypeReference' &&
               node.parent.typeAnnotation.typeName.type === 'Identifier' &&
               node.parent.typeAnnotation.typeName.name === 'const'
            )
               return; // ignore const a = [] as const because array will be not modified;

            if (node.type.startsWith('TS')) return;

            const our = getRange(node);
            const args = source.substring(our.start + 1, our.end - 1);
            const replaceWith = `${kernelAccess('Array')}.from(${args})`;

            context.report({
               node,
               messageId: 'useKernel',
               data: { args: replaceWith },
               fix(fixer) {
                  return [fixer.replaceTextRange([our.start, our.end], replaceWith)];
               },
            });
         },
      };

      /** @import {TSESTree} from "@typescript-eslint/utils" */

      /** @param {TSESTree.Identifier | TSESTree.JSXIdentifier} node */
      function reportReference(node) {
         if (node.parent.type.startsWith('TS')) return;

         const parent = getRange(node.parent);
         const our = getRange(node);
         const name = node.name;
         const isNew = node.parent.type === 'NewExpression';
         const args = isNew
            ? source.substring(parent.start + our.start - parent.start + name.length + 1, parent.end - 1)
            : '';

         const replaceWith = isNew
            ? `${kernelConstruct}("${name}"${args ? ', ' + args : ''})`
            : `${kernelAccess(name)}${args ? `(${args})` : args}`;

         context.report({
            node: node,
            messageId: 'useKernel',
            data: { args: replaceWith },
            fix(fixer) {
               return [fixer.replaceTextRange(isNew ? [parent.start, parent.end] : [our.start, our.end], replaceWith)];
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
      return {
         YieldExpression(node) {
            if (!node.delegate) return;
            // @ts-expect-error TODO Proper type fix
            node = node.argument;

            // @ts-expect-error TODO Proper type fix
            if (node.type !== 'CallExpression')
               context.report({
                  messageId: 'unsafeIterator',
                  node: node,
               });
            // @ts-expect-error TODO Proper type fix
            else if (node.callee.object && node.callee.object?.name !== 'Kernel')
               context.report({
                  messageId: 'unsafeIterator',
                  node: node,
               });
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
               });
         },
         ArrayPattern(node) {
            if (node.parent.type === 'VariableDeclarator') {
               if (!node.parent.init) return;
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
                  });
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

const name = '@bedrock-apis/virtual-apis/eslint.plugin';

export const plugin = {
   rules: {
      'no-globals': noGlobals,
      'no-default-extends': noDefaultClasses,
      'no-iterators': noUnsafeIterators,
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
