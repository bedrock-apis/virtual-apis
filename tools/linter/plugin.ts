import noArrayExpression from './rules/no-array-expression';
import noDefaultClasses from './rules/no-default-classes';
import noGlobals from './rules/no-global';
import noUnsafeIterators from './rules/no-unsafe-iterators';

const name = '@bedrock-apis/virtual-apis/eslint-plugin';
const kernel = 'Kernel';
export const kernelArrayConstruct = 'KernelArray.Construct';
export const kernelAccess = (globalName: string) => `${kernel}['globalThis::${globalName}']`;

export const plugin = {
   rules: {
      'no-globals': noGlobals,
      'no-default-extends': noDefaultClasses,
      'no-iterators': noUnsafeIterators,
      'no-array-expression': noArrayExpression,
   },
};

export const recommended: import('@typescript-eslint/utils/ts-eslint').FlatConfig.Config = {
   plugins: {
      [name]: plugin,
   },
   rules: {
      [`${name}/no-globals`]: 'error',
      [`${name}/no-default-extends`]: 'error',
      [`${name}/no-iterators`]: 'error',
      [`${name}/no-array-expression`]: 'error',
   },
};

export default { recommended, plugin };
