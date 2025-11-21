import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsEslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'
import storybook from 'eslint-plugin-storybook'

export default defineConfig([
    globalIgnores(['dist', '.storybook']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [js.configs.recommended, tsEslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite, eslintConfigPrettier],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
            '@typescript-eslint/no-explicit-any': "off"
        },
    },
    {
        files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
        extends: [...storybook.configs['flat/recommended']],
    },
])
