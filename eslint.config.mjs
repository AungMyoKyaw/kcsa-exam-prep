import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'public']),

  // Base JS + TypeScript strict + stylistic
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  // CJS config files (tailwind, postcss, etc.) - override strict rules
  {
    files: ['**/*.config.js', '**/*.config.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },

  // React + JSX runtime (React 19 uses automatic runtime)
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript strict additions
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      // React strict
      'react/jsx-key': 'error',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': ['error', { ignore: ['whileHover', 'whileTap', 'whileDrag', 'whileFocus', 'whileInView', 'animate', 'initial', 'exit', 'transition', 'variants', 'layout', 'layoutId'] }],
      'react/no-unsafe': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      // React Hooks (recommended-latest already covers these, but be explicit)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // General strict
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'require-atomic-updates': 'error',
      'no-promise-executor-return': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-optional-chaining': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'object-shorthand': ['error', 'always'],
      'no-unused-private-class-members': 'error',
      'no-useless-assignment': 'error',

      // Stylistic / best practices
      'curly': ['error', 'all'],
      'default-case': 'error',
      'default-case-last': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-lone-blocks': 'error',
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-rest-params': 'error',
      'prefer-regex-literals': 'error',
      'radix': 'error',
      'require-await': 'error',
      'sort-imports': 'off',
    },
  },
])
