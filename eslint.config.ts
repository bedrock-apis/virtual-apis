import bedrock from '@bedrock-apis/eslint-plugin';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
   {
      ignores: [
         '**/*.test.ts',
         '**/dist/**',
         '**/ref-bapi-nbt/**',
         'examples/**',
         'modules/**',
         'bds-docs/**',
         'bds-docs-stable/**',
         '**/*.js',
         'libs/binary/**',
      ],
   },
   eslint.configs.recommended,
   ...tseslint.configs.strict,
   {
      files: ['packages/**/*.ts', 'libs/**/*.ts', '*.ts'],
      languageOptions: {
         ecmaVersion: 2024,
         sourceType: 'module',
         parserOptions: {
            project: './tsconfig.json',
         },
      },
      plugins: {
         custom: bedrock.plugin,
      },
      linterOptions: { reportUnusedDisableDirectives: true },
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
      files: ['packages/{virtual-apis,va-pluggable,core-plugin}/**/*.ts', 'libs/kernel-isolation/**/*.ts'],
      rules: {
         'custom/no-globals': 'error',
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
         format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
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
