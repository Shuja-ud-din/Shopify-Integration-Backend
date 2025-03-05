import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import eslintParserTs from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    ignores: ['dist/**', 'node_modules/**'],

    languageOptions: {
      parser: eslintParserTs,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
      prettier: eslintPluginPrettier,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
