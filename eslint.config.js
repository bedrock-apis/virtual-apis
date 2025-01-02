import eslint from '@eslint/js';
import tseslint, { rules } from '@typescript-eslint/eslint-plugin';
import bedrock from './eslint-plugin.js';
import tsParser from '@typescript-eslint/parser';
import { ESLint } from 'eslint';

ESLint.defaultConfig
export default [
   {
      ignores: ['**/*.test.ts', 'dist/**', 'examples/**', '**/*.test.ts', 'modules/**'],
   },
   {
      files: ['src/**/*.ts'],
      languageOptions: {
         parser: tsParser, // Set the TypeScript parser
         ecmaVersion: 2024,
         sourceType: 'module',
         parserOptions: {
            project: './tsconfig.json',
         },
      },
      linterOptions: { reportUnusedDisableDirectives: true },
      rules: {
         // Include plugin rules explicitly
         ...eslint.configs.recommended.rules,
         ...tseslint.configs['eslint-strict'],
         '@typescript-eslint/no-extraneous-class': 'off',
         '@typescript-eslint/no-unused-vars': 'off',
         '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
         '@typescript-eslint/naming-convention': ['warn', ...namingConvention()],
         '@typescript-eslint/no-dupe-class-members': 'off'
      },
      plugins: {
         '@typescript-eslint': tseslint, // Add the TypeScript ESLint plugin
         custom: bedrock.plugin,
      },
   },
   {

      files: ['src/**/*.ts'],
      ignores: ['src/package-builder/**', 'src/loader/**'],
      languageOptions: {
         parser: tsParser, // Set the TypeScript parser
         ecmaVersion: 2024,
         sourceType: 'module',
         parserOptions: {
            project: './tsconfig.json',
         },
      },
      plugins: {
         custom: bedrock.plugin,
      },
      rules: {
         'custom/no-globals': 'error',
         'custom/no-default-extends': 'warn',
         'custom/no-iterators': 'error',
         'custom/no-array-expression': 'error'
      }
   }
];

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
