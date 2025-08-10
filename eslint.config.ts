import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
   {
      ignores: [
         'legacy-store/**/*.ts',
         '**/*.test.ts',
         '**/dist/**',
         '**/bin/**',
         'examples/**',
         'modules/**',
         'bds-docs/**',
         'bds-docs-stable/**',
         '**/*.js',
         'libs/binary/ref-bapi-nbt/**',
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
      plugins: {},
      linterOptions: { reportUnusedDisableDirectives: true },
      rules: {
         '@typescript-eslint/no-extraneous-class': 'off',
         '@typescript-eslint/no-unused-vars': 'off',
         '@typescript-eslint/no-non-null-assertion': 'off',
         '@typescript-eslint/prefer-literal-enum-member': 'off',
         '@typescript-eslint/explicit-member-accessibility': ['warn', { accessibility: 'explicit' }],
         '@typescript-eslint/naming-convention': ['warn', ...namingConvention()],

         'no-dupe-class-members': 'off',
         'no-undef': 'off',
         'no-unused-vars': 'off',
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
      { selector: 'classMethod', modifiers: ['static'], format: ['camelCase'] },
      { selector: 'classMethod', format: ['camelCase'], leadingUnderscore: 'allowDouble' },
      { selector: 'classProperty', modifiers: ['readonly', 'public'], format: ['camelCase'] },
      { selector: 'import', format: ['camelCase', 'PascalCase'] },
      { selector: 'typeLike', format: ['PascalCase'] },
   ];
}
