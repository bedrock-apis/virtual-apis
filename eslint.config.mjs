import jseslint from '@eslint/js'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },
  jseslint.configs.recommended,
  ...tseslint.configs.strict,
]
