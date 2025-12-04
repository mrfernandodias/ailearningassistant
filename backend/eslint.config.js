import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'uploads/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Variáveis não usadas - warning ao invés de error (útil durante desenvolvimento)
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_', // Ignora argumentos que começam com _
          varsIgnorePattern: '^_', // Ignora variáveis que começam com _
        },
      ],

      // Console é permitido no backend (logs são normais)
      'no-console': 'off',

      // Boas práticas modernas
      'prefer-const': 'error', // Use const quando não reatribuir
      'no-var': 'error', // Nunca use var, apenas let/const
      eqeqeq: ['error', 'always'], // Use === ao invés de ==

      // Evitar erros comuns
      'no-throw-literal': 'error', // throw new Error() ao invés de throw 'string'
      'no-unused-expressions': 'error',
    },
  },
];
