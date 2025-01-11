import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import bedrock from './eslint-plugin.js';

export default tseslint.config(
   {
      ignores: ['**/*.test.ts', 'dist/**', 'examples/**', '**/*.test.ts', 'modules/**'],
   },
   eslint.configs.recommended,
   ...tseslint.configs.strict,
   {
      files: ['src/**/*.ts'],
      languageOptions: {
         ecmaVersion: 2024,
         sourceType: 'module',
         parserOptions: {
            project: './tsconfig.json',
         },
      },
      linterOptions: { reportUnusedDisableDirectives: true },
      plugins: {
         custom: bedrock.plugin,
      },
      rules: {
         '@typescript-eslint/no-extraneous-class': 'off',
         '@typescript-eslint/no-unused-vars': 'off',
         '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
         '@typescript-eslint/naming-convention': ['warn', ...namingConvention()],

         'no-dupe-class-members': 'off',
         'no-undef': 'off',
         'no-unused-vars': 'off',
      },
   },
   {
      files: ['src/**/*.ts'],
      ignores: ['src/package-builder/**', 'src/loader/**'],
      rules: {
         'custom/no-globals': 'error',
         '@typescript-eslint/no-unused-vars': 'off',
         'custom/no-default-extends': 'warn',
         'custom/no-iterators': 'error',
         'custom/no-array-expression': 'error',
      },
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
      { selector: 'import', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
   ];
}
