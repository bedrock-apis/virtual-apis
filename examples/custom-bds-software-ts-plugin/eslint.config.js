// @ts-check
import bedrock from '@bedrock-apis/virtual-apis/eslint-plugin';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
   { ignores: ['**/*.test.ts'] },
   {
      files: ['src/**/*.ts', 'virtual-apis/**/*.ts'],
      linterOptions: { reportUnusedDisableDirectives: true },
      extends: [
         eslint.configs.recommended,
         ...tseslint.configs.strict,
         {
            ignores: ['src/**'],
            ...bedrock.recommended,
         },
      ],
   },
);
