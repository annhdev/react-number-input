import { create } from 'storybook/theming';

export default create({
    base: 'light',
    /**
     * Typography
     */
    fontBase: '"Open Sans", sans-serif',
    fontCode: 'monospace',
    brandTitle: 'React Input Storybook',
    brandUrl: 'https://example.com',
    brandImage: './vite.svg',
    brandTarget: '_self',

    /**
     * Color palette
     */
    // colorPrimary: '#3A10E5',
    // colorSecondary: '#585C6D',

    /**
     * UI colors
     */
    // appBg: '#ffffff',
    // appContentBg: '#ffffff',
    // appPreviewBg: '#ffffff',
    // appBorderColor: '#585C6D',
    // appBorderRadius: 4,

    /**
     * Text colors
     */
    textColor: '#10162F',
    textInverseColor: '#ffffff',

    /**
     * Toolbar default and active colors
     */
    // barTextColor: '#9E9E9E',
    // barSelectedColor: '#585C6D',
    // barHoverColor: '#585C6D',
    // barBg: '#ffffff',

    /**
     * Form colors
     */
    // inputBg: '#ffffff',
    // inputBorder: '#10162F',
    // inputTextColor: '#10162F',
    // inputBorderRadius: 2,
});