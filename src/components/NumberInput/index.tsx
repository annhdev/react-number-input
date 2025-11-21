import './style.css'
import { type ChangeEvent, type FocusEvent, type InputHTMLAttributes, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
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

export const NumberInput = ({ id, name, value = '', onValueChange, thousandSeparator = ',', decimalSeparator = '.', decimalLimit = 2, allowNegative, placeholder, className, min, max, step = 1, ...rest }: NumberInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [displayValue, setDisplayValue] = useState<string>('')

    /* ------------------------------------------------------------------ */
    /* Helpers                                                            */
    /* ------------------------------------------------------------------ */

    // utility to escape regex special characters
    const escapeRegExp = useCallback((s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), [])

    // safe multiply to handle large numbers with exponents
    const safeMultiply = (value: number, multiplier: number): number => {
        if (!isFinite(value) || !isFinite(multiplier)) {
            return NaN
        }

        const exponent = Math.log10(multiplier)
        if (Number.isInteger(exponent)) {
            const expString = value.toExponential()
            const [mantissa, currentExp] = expString.split('e')
            const newExp = parseInt(currentExp) + exponent
            return parseFloat(mantissa + 'e' + newExp)
        }

        return value * multiplier
    }

    // parse input to handle abbreviations
    const parseInput = useCallback(
        function parser(raw: string): string  {
            const stripped = raw.trim()
            const escapedThousandSeparator = escapeRegExp(thousandSeparator)
            const escapedDecimalSeparator = escapeRegExp(decimalSeparator)

            // handle negative sign
            if (allowNegative && stripped.startsWith('-')) {
                return '-' + parser(stripped.slice(1))
            }

            const specialChars = ['\\', '^', '$', '*', '+', '?', '.', '(', ')', '|', '{', '}', '[', ']']
            // if escapedThousandSeparator is special character in regex, we need to handle it
            let ts = escapedThousandSeparator
            if (specialChars.includes(thousandSeparator)) {
                ts = `\\${thousandSeparator}`
            }

            // if escapedDecimalSeparator is special character in regex, we need to handle it
            let ds = escapedDecimalSeparator
            if (specialChars.includes(decimalSeparator)) {
                ds = `\\${decimalSeparator}`
            }

            const stringRegex = `^([+-]?)(([0-9${ts}]*)([${ds}])?([0-9]+)?)([kKmMbBtT])?`
            const abbrevRegx = new RegExp(stringRegex, 'i')
            const abbrevMatch = stripped.match(abbrevRegx)
            if (abbrevMatch && abbrevMatch[6]) {
                let num = parseFloat(abbrevMatch[2].replace(/\D/g, ''))
                const suffix = abbrevMatch[6]?.toLowerCase()
                if (suffix) {
                    switch (suffix) {
                        case 'k':
                            num = safeMultiply(num, 1_000)
                            break
                        case 'm':
                            num = safeMultiply(num, 1_000_000)
                            break
                        case 'b':
                            num = safeMultiply(num, 1_000_000_000)
                            break
                        case 't':
                            num = safeMultiply(num, 1_000_000_000_000)
                            break
                    }
                }
                return num.toString()
            }
            return stripped
        },
        [allowNegative, decimalSeparator, escapeRegExp, thousandSeparator]
    )

    // format value for display
    const formatValue = useCallback(
        (raw: string | number): { raw: number; formated: string } => {
            const stripped = typeof raw === 'string' ? raw.trim() : raw.toString()
            const parsed = parseInput(stripped)

            const sepRegex = new RegExp(escapeRegExp(thousandSeparator), 'g')
            const cleaned = parsed.replace(sepRegex, '')

            // split at the first decimal separator
            const parts = cleaned.split(decimalSeparator)
            let intPart = parts[0]
            let fracPart = parts[1] ?? ''

            // handle negative sign
            if (allowNegative && intPart.startsWith('-')) {
                // keep sign and only digits
                intPart = '-' + intPart.slice(1).replace(/\D/g, '')
            } else {
                // keep only digits
                intPart = intPart.replace(/\D/g, '')
            }

            // keep only digits
            fracPart = fracPart.replace(/\D/g, '').slice(0, decimalLimit)

            // format integer part with thousand separators
            const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)

            if (parsed.endsWith(decimalSeparator) || parsed.endsWith(`${decimalSeparator}0`)) {
                return { raw: parseFloat(`${intPart}${decimalSeparator}${fracPart}`), formated: `${formattedInt}${decimalSeparator}${fracPart}` }
            }

            return fracPart ? { raw: parseFloat(`${intPart}${decimalSeparator}${fracPart}`), formated: `${formattedInt}${decimalSeparator}${fracPart}` } : { raw: parseFloat(intPart), formated: formattedInt }
        },
        [parseInput, escapeRegExp, thousandSeparator, decimalSeparator, allowNegative, decimalLimit]
    )

    useEffect(() => {
        setDisplayValue(formatValue(value?.toString() || '').formated)
    }, [formatValue, value])

    const handleInput = (_e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = _e.target.value
        // current cursor position
        const cursorPos = _e.target.selectionStart || 0

        // format the value
        const formattedValue = formatValue(rawValue)

        setDisplayValue(formattedValue.formated)
        onValueChange(formattedValue.raw, formattedValue.formated)

        // adjust cursor position
        setTimeout(() => {
            if (inputRef.current) {
                let newCursorPos = cursorPos + (formattedValue.formated.length - rawValue.length)
                newCursorPos = Math.max(0, Math.min(newCursorPos, formattedValue.formated.length))
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
            }
        }, 0)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        // on blur, ensure the value is properly formatted
        const formattedValue = formatValue(e.target.value)
        setDisplayValue(formattedValue.formated)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()

            const current = value ? formatValue(value).raw : 0
            const delta = e.key === 'ArrowUp' ? step : -step

            let next = current + delta
            if (min !== undefined) next = Math.max(next, min)
            if (max !== undefined) next = Math.min(next, max)

            console.log(next)

            const formattedNext = formatValue(next)
            setDisplayValue(formattedNext.formated)
            onValueChange(formattedNext.raw, formattedNext.formated)
            // `useEffect` will update `display` automatically
        }
    }

    return <input id={id} name={name} type='text' ref={inputRef} value={displayValue} onChange={handleInput} onBlur={handleBlur} onKeyDown={handleKeyDown} placeholder={placeholder} className={className} aria-label={'Number input'} {...rest} />
}