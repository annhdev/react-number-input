import { ChangeEvent, InputHTMLAttributes } from '../../../node_modules/react';
export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    /** Current value (raw number string or number). */
    value?: string | number;
    /** Callback with the raw numeric value (no separators). */
    onValueChange?: (value: string, num: number, formated: string) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    /** Thousand separator – default “,” */
    thousandSeparator?: string;
    /** Decimal separator – default “.” */
    decimalSeparator?: string;
    /** Max digits allowed after the decimal point. */
    decimalLimit?: number;
    /** Allow negative numbers? (default: false). */
    allowNegative?: boolean;
    /** Optional standard input props */
    placeholder?: string;
    className?: string;
    id?: string;
    name?: string;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step value for arrow key increments/decrements (default: 1) */
    step?: number;
    /** any other standard <input> props can be forwarded via `...rest` */
    [key: string]: any;
}
declare const NumberInput: ({ id, name, value, onValueChange, onChange, thousandSeparator, decimalSeparator, decimalLimit, allowNegative, placeholder, className, min, max, step, ...rest }: NumberInputProps) => import("react/jsx-runtime").JSX.Element;
export default NumberInput;
