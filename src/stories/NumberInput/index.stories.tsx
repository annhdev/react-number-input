import type { Meta, StoryObj } from '@storybook/react-vite'

import { fn } from 'storybook/test'

import NumberInputPreview from './number-input.preview.tsx'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: 'Example/NumberInput',
    component: NumberInputPreview,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: 'centered',
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ['autodocs'],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        value: { control: 'number' },
        onValueChange: { action: 'value changed' },
        placeholder: { control: 'text' },
        className: { control: 'text' },
        decimalLimit: { control: 'number' },
        step: { control: 'number' },
        min: { control: 'number' },
        max: { control: 'number' },
        thousandSeparator: { control: 'text' },
        decimalSeparator: { control: 'text' },
        allowNegative: { control: 'boolean' },
        backgroundColor: { control: 'color' },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#story-args
    args: { onClick: fn() },
} satisfies Meta<typeof NumberInputPreview>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
    args: {
        value: 1000,
        thousandSeparator: ',',
        decimalSeparator: '.',
        decimalLimit: 2,
        placeholder: 'Enter a number',
        onValueChange: fn(),
        className: 'border border-gray-300 rounded focus:border-primary outline-0 px-3 py-2 dark:text-white gray:text-white blue:text-white',
    },
}
