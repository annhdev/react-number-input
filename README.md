# React Number Input

[![npm](https://img.shields.io/npm/v/react-currency-number-input)](https://www.npmjs.com/package/react-currency-number-input)
[![npm](https://img.shields.io/npm/dm/react-currency-number-input)](https://www.npmjs.com/package/react-currency-number-input)
[![NPM](https://img.shields.io/npm/l/react-currency-number-input)](https://www.npmjs.com/package/react-currency-number-input)

React component INPUT currency and numbers.

## Features
- Automatic insertion of thousand separators
- Support for decimal places
- Currency formatting
- Customizable decimal and thousand separators
- Handles negative numbers
- Supports abbreviations (K, M, B, T) (e.g., 1.2K for 1,200 or 3.5M for 3,500,000 etc.)
- Easy to use with React
- Lightweight and fast

## Demo
You can see a live demo of the component [here](https://annhdev.github.io/react-number-input/).

## Installation

```bash
npm install react-number-input
```

## Usage

```jsx
import React, { useState } from 'react';
import NumberInput from 'react-number-input';

const App = () => {
  const [value, setValue] = useState(0);

  return (
    <div>
      <h1>React Number Input Example</h1>
      <NumberInput
        value={value}
        onValueChange={(value, formatted) => setValue(value)}
        decimalLimit={2}
        thousandSeparator={','}
        decimalSeparator={'.'}
        allowNegative={true}
        placeholder="Enter a number"
        step={1}
      />
      <p>Current Value: {value}</p>
    </div>
  );
};
export default App;
```

## Props

| Name                                               | Type                | Default        | Description                                                                                                  |
| -------------------------------------------------- | ------------------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| `value`                                            | `string` \| `number` | `""`           | The current value of the input field.                                                                        |
| `onValueChange`                                    | `function`          | `undefined`    | Callback function called when the value changes. Receives the raw numeric value and formatted string.          |
| `decimalLimit`                                     | `number`            | `undefined`    | Maximum number of digits allowed after the decimal point.                                                     |
| `thousandSeparator`                                | `string`            | | `","`          | Character to use as the thousand separator.                                                                  |
| `decimalSeparator`                                 | `string`            | `". "`         | Character to use as the decimal separator.                                                                     |
| `allowNegative`                                    | `boolean`           | `false`        | | Whether to allow negative numbers.                                                                           |
| `placeholder`                                      | `string`            | | `""`           | Placeholder text for the input field.                                                                        |
| `min`                                              | `number`            | `undefined`    | Minimum value allowed.                                                                                        |
| `max`                                              | `number`            | `undefined`    | Maximum value allowed.                                                                                        |
| `step`                                             | `number`            | `1`            | Increment/decrement step value.                                                                               |
| Other standard input props                         |                     |                | All other standard HTML input props are supported.                                                              |

### onValueChange

Handle changes to the value.

```js
    onValueChange = (value, formated) => void;
```
- `value`: The raw numeric value (e.g., `1234.56`).
- `formated`: The formatted string value (e.g., `"1,234.56"`).

### decimalLimit

Maximum number of digits allowed after the decimal point.

```js
    decimalLimit = number;
```
- `number`: Maximum digits after the decimal point (e.g., `2` for two decimal places).
Examples:
- If `decimalLimit` is set to `2`, the input will allow values like `1234.56` but not `1234.567`.
- If `decimalLimit` is set to `0`, only whole numbers will be allowed.

### thousandSeparator
Character to use as the thousand separator.

```js
    thousandSeparator = string | boolean;
```
- `string`: Character to use as the thousand separator (e.g., `","` for comma, `"."` for dot).
- `boolean`: If set to `true`, defaults to comma (`,`) as the thousand separator.
Examples:
- If `thousandSeparator` is set to `","`, the input will format `1234567` as `1,234,567`.
- If `thousandSeparator` is set to `"."`, the input will format `1234567` as `1.234.567`.

### decimalSeparator
Character to use as the decimal separator.
```js
    decimalSeparator = string;
```
- `string`: Character to use as the decimal separator (e.g., `"."` for dot, `","` for comma).
Examples:
- If `decimalSeparator` is set to `"."`, the input will format `1234.56` as `1,234.56`.
- If `decimalSeparator` is set to `","`, the input will format `1234,56` as `1.234,56`.

### allowNegative
Whether to allow negative numbers.
```js
    allowNegative = boolean;
```
- `boolean`: If set to `true`, negative numbers are allowed; if `false`, only positive numbers are allowed.
Examples:
- If `allowNegative` is set to `true`, the input will accept values like `-1234.56`.
- If `allowNegative` is set to `false`, the input will only accept values like `1234.56`.

### abbreviations
Always support abbreviations for large numbers.
Examples:
- `1.2K` for `1,200`
- `3.5M` for `3,500,000`
- `7.8B` for `7,800,000,000`
- `9.1T` for `9,100,000,000,000`
- `abbreviations` is always enabled and does not require a separate prop.

## License
MIT License © 2024 AnnhDev