import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ['**/*.js', '**/*.test.ts'] },
  { files: ['src/**/*.ts}'] },
  jseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
    },
  },
];
