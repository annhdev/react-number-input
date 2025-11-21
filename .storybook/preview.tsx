import '../src/tailwind.css'
import type { Preview } from '@storybook/react-vite'
import type {} from '@storybook/react'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'todo',
        },

        backgrounds: {
            default: 'light',
            options: {
                light: {
                    name: 'Light',
                    value: '#ffffff',
                },
                dark: {
                    name: 'Dark',
                    value: '#000000',
                },
                gray: {
                    name: 'Gray',
                    value: '#888888',
                },
                blue: {
                    name: 'Blue',
                    value: '#2E48A0',
                },
            },
        },
        initialGlobals: {
            // 👇 Set the initial background color
            backgrounds: { value: 'light' },
        },
    },
    decorators: [
        (Story, context) => {
            const selectedBackground = context.globals.backgrounds?.value || 'light'
            document.documentElement.setAttribute('data-mode', selectedBackground)
            return <Story />
        },
    ],
}

export default preview
