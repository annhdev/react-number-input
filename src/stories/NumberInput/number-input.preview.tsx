import { type InputHTMLAttributes, useState } from 'react'
import { NumberInput } from '../../components/NumberInput'

export interface NumberInputPreviewProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    /** Current value (raw number string or number). */
    value: string | number | null
    /** Callback with the raw numeric value (no separators). */
    onValueChange: (value: number, formated: string) => void

    /** Thousand separator – default “,” */
    thousandSeparator?: string
    /** Decimal separator – default “.” */
    decimalSeparator?: string
    /** Max digits allowed after the decimal point. */
    decimalLimit?: number
    /** Allow negative numbers? (default: false). */
    allowNegative?: boolean

    /** Optional standard input props */
    placeholder?: string
    className?: string
    id?: string
    name?: string

    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step value for arrow key increments/decrements (default: 1) */
    step?: number

    /** any other standard <input> props can be forwarded via `...rest` */
    [key: string]: any
}


const NumberInputPreview = ({ id, name, value = '', onValueChange, thousandSeparator = ',', decimalSeparator = '.', decimalLimit = 2, allowNegative, placeholder, className, min, max, step = 1, ...rest }:NumberInputPreviewProps) => {
    
    const [price, setPrice] =  useState<number | null>(value as number | null);

    const handleValueChange = (val: number, formatted: string) => {
        setPrice(val);
        onValueChange(val, formatted);
    }
    
    return <NumberInput
        value={price}
        onValueChange={handleValueChange}
        thousandSeparator={thousandSeparator}
        decimalSeparator={decimalSeparator}
        decimalLimit={decimalLimit}
        allowNegative={allowNegative}
        placeholder={placeholder}
        className={className}
        id={id}
        name={name}
        min={min}
        max={max}
        step={step}
        {...rest}
    />

}

export default NumberInputPreview