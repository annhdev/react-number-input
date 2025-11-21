/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'node:path'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { fileURLToPath } from 'node:url'
import { globSync } from 'glob'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'
import storybookTest from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    publicDir: false,
    plugins: [
        react(),
        libInjectCss(),
        dts({
            exclude: ['**/*.stories.ts', '**/*.stories.tsx', 'src/stories', 'src/test', '**/*.test.tsx', '.storybook/**/*.ts', '.storybook/**/*.tsx'],
            tsconfigPath: 'tsconfig.app.json',
        }),
        tailwindcss(),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            formats: ['es'],
        },
        rolldownOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '**/*.stories.tsx', '**/*.stories.ts', 'src/stories', '.storybook'],
            input: Object.fromEntries(
                globSync(['src/components/**/index.tsx', 'src/main.ts']).map((file) => {
                    // This remove `src/` as well as the file extension from each
                    // file, so e.g. src/nested/foo.js becomes nested/foo
                    const entryName = path.relative('src', file.slice(0, file.length - path.extname(file).length))
                    // This expands the relative paths to absolute paths, so e.g.
                    // src/nested/foo becomes /project/src/nested/foo.js
                    const entryUrl = fileURLToPath(new URL(file, import.meta.url))
                    return [entryName, entryUrl]
                })
            ),
            output: {
                entryFileNames: '[name].js',
                assetFileNames: 'assets/[name][extname]',
                globals: {
                    react: 'React',
                    'react-dom': 'React-dom',
                    'react/jsx-runtime': 'react/jsx-runtime',
                },
            },
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        // you might want to disable it, if you don't have tests that rely on CSS
        // since parsing CSS is slow
        css: true,
        coverage: {
            provider: 'v8',
            include: ['src/components'],
            exclude: ['**/*.stories.tsx'],
        },
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(__dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
})
