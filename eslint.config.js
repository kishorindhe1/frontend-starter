// eslint.config.js
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import unusedImports from 'eslint-plugin-unused-imports';
import tses from 'typescript-eslint';

export default tses.config(
  js.configs.recommended,
  ...tses.configs.recommended,
  ...tses.configs.stylistic,
  {
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',

      // Production-grade rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['warn', { args: 'after-used' }],
      'no-console': ['error', { allow: ['error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/naming-convention': [
        'error',

        // Type aliases → Must start with T
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },

        // Interfaces → Must start with I
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
      ],
      'id-denylist': [
        'error',
        'temp',
        'result',

        // ❌ Block single-letter variables
        '^.$',

        // ❌ Block anything starting with tmp, temp, res, data
        '^tmp',
        '^temp',
        '^res',
        '^data',

        // ❌ Block variables ending with 'Obj'
        '.*Obj$',

        // ❌ Block meaningless generic names
        '^value$',
        '^item$',
        '^info$',
      ],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.js'],
  }
);
