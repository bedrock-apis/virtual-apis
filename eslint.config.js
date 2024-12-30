// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import bedrock from './eslint-plugin.js';

export default tseslint.config(
   {
      ignores: ['**/*.test.ts', 'dist/**', 'examples/**', '**/*.test.ts', 'modules/**'],
   },
   {
      files: ['src/**/*.ts'],
      linterOptions: { reportUnusedDisableDirectives: true },
      extends: [
         eslint.configs.recommended,
         ...tseslint.configs.strict,
         {
            rules: {
               '@typescript-eslint/no-extraneous-class': 'off',
               '@typescript-eslint/no-unused-vars': 'off',
               '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
               '@typescript-eslint/naming-convention': ['warn', ...namingConvention()],
            },
         },
         {
            ignores: ['src/package-builder/**', 'src/loaders/**'],
            plugins: {
               custom: bedrock.plugin,
            },
            rules: {
               [`custom/no-globals`]: 'error',
               [`custom/no-default-extends`]: 'error',
               [`custom/no-iterators`]: 'error',
            },
         },
      ],
   },
);

// https://typescript-eslint.io/rules/naming-convention/
function namingConvention() {
   return [
      {
         selector: 'variable',
         modifiers: ['const', 'global'],
         format: ['UPPER_CASE', 'PascalCase'],
      },
      {
         selector: 'variable',
         modifiers: ['const'],
         format: ['camelCase'],
      },

      {
         selector: 'variable',
         modifiers: ['destructured'],
         format: ['camelCase', 'PascalCase', 'snake_case'],
      },

      { selector: 'variable', format: ['camelCase'] },

      { selector: 'function', format: ['camelCase'] },

      { selector: 'classMethod', modifiers: ['static'], format: ['PascalCase'] },
      { selector: 'classMethod', format: ['camelCase'], leadingUnderscore: 'allowDouble' },

      { selector: 'classProperty', modifiers: ['readonly', 'private'], format: ['UPPER_CASE'] },
      { selector: 'classProperty', modifiers: ['readonly', 'public'], format: ['camelCase'] },

      {
         selector: 'import',
         format: ['camelCase', 'PascalCase'],
      },

      {
         selector: 'typeLike',
         format: ['PascalCase'],
      },
   ];
}
