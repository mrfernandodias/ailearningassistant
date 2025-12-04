import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Variáveis não usadas - ignora componentes React (PascalCase) e constantes
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // React Hooks
      'react-hooks/exhaustive-deps': 'warn', // Avisar sobre dependências faltando no useEffect
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Console.log - warn para não esquecer em produção
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // Boas práticas modernas
      'prefer-const': 'error', // Use const quando não reatribuir
      'no-var': 'error', // Nunca use var, apenas let/const
      eqeqeq: ['error', 'always'], // Use === ao invés de ==
    },
  },
]);
