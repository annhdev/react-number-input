import { Decimal } from 'decimal.js'
import { type ChangeEvent, type InputHTMLAttributes, type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

export interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> {
    /** Current value (raw number string or number). */
    value?: string | number
    /** Callback with the raw numeric value (no separators). */
    onValueChange?: (value: string, num: number, formated: string) => void
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void

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

export const NumberInput = ({ id, name, value, onValueChange, onChange, thousandSeparator = ',', decimalSeparator = '.', decimalLimit = 2, allowNegative, placeholder, className, min, max, step = 1, ...rest }: NumberInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [displayValue, setDisplayValue] = useState<string>('')
    const safeDecimalLimit = Math.min(Math.max(decimalLimit, 0), 15)

    Decimal.set({ maxE: 15 })

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

    const getDecimalPlaces = useCallback(
        (number: number | string, isInit: boolean) => {
            // Convert the number to a string
            const numString = typeof number === 'number' ? number.toFixed() : number.trim()

            // Find the index of the decimal point
            const decimalIndex = numString.indexOf(isInit ? '.' : decimalSeparator)

            // If there's no decimal point, return 0
            if (decimalIndex === -1) {
                return 0
            }

            // Calculate the number of digits after the decimal point
            return numString.length - decimalIndex - 1
        },
        [decimalSeparator]
    )

    // parse input to handle abbreviations
    const parseInput = useCallback(
        function parse(raw: string | number): string {
            const stripped = typeof raw === 'number' ? new Decimal(raw).toFixed() : raw.trim()

            const escapedThousandSeparator = escapeRegExp(thousandSeparator)
            const escapedDecimalSeparator = escapeRegExp(decimalSeparator)

            // handle negative sign
            if (allowNegative && stripped.startsWith('-')) {
                return '-' + parse(stripped.slice(1))
            }

            const stringRegex = `^([+-]?)(([0-9${escapedThousandSeparator}]*)([${escapedDecimalSeparator}])?([0-9]+)?)([kKmMbBtT])?`
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
    // Raw: "1234.56" Formatted: "1,234.56"
    const formatValue = useCallback(
        (raw: string | number, isInit = false): { raw: string; num: number; formated: string } => {
            let stripped = typeof raw === 'number' ? new Decimal(raw).toFixed() : raw.trim()
            if (stripped.indexOf('e') !== -1 || stripped.indexOf('E') !== -1) {
                stripped = new Decimal(stripped).toFixed()
            }

            const decimalPlaces = getDecimalPlaces(stripped, isInit)
            if (decimalPlaces > safeDecimalLimit) {
                stripped = new Decimal(stripped).toFixed(safeDecimalLimit)
            }

            if (isInit) {
                stripped = stripped.replace('.', decimalSeparator)
            }

            const parsed = parseInput(stripped)
            const escapedThousandSeparator = escapeRegExp(thousandSeparator)

            const sepRegex = new RegExp(escapedThousandSeparator, 'g')
            const cleaned = parsed.replace(sepRegex, '')

            // split at the first decimal separator
            const parts = cleaned.split(decimalSeparator)
            let intPart = parts[0]
            let fracPart = parts[1] ?? ''

            if (parseInt(fracPart) === 0) {
                fracPart = ''
            }

            // handle negative sign
            if (allowNegative && intPart.startsWith('-')) {
                // keep sign and only digits
                intPart = '-' + intPart.slice(1).replace(/\D/g, '')
            } else {
                // keep only digits
                intPart = intPart.replace(/\D/g, '')
            }

            if (parseInt(intPart) === 0) {
                intPart = '0'
            }

            // keep only digits
            fracPart = fracPart.replace(/\D/g, '').slice(0, safeDecimalLimit)

            // format integer part with thousand separators
            const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
            const finalRawValue = fracPart && fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart ? intPart : '0'
            const finalNumber = new Decimal(finalRawValue).toNumber()

            if (finalNumber > new Decimal(`1e${Decimal.maxE - decimalPlaces}`).toNumber() || finalNumber < new Decimal(`-1e${Decimal.maxE - decimalPlaces}`).toNumber() || finalNumber === Infinity || finalNumber === -Infinity) {
                return { raw: '', num: Infinity, formated: '' }
            }

            if (parsed.endsWith(decimalSeparator) || parsed.endsWith(`${decimalSeparator}0`)) {
                return { raw: finalRawValue, num: finalNumber, formated: `${formattedInt}${decimalSeparator}${fracPart}` }
            }

            return fracPart && fracPart.length > 0 ? { raw: finalRawValue, num: finalNumber, formated: `${formattedInt ? formattedInt : '0'}${decimalSeparator}${fracPart}` } : { raw: finalRawValue, num: finalNumber, formated: formattedInt }
        },
        [getDecimalPlaces, parseInput, escapeRegExp, thousandSeparator, decimalSeparator, allowNegative, safeDecimalLimit]
    )

    useEffect(() => {
        const formattedValue = formatValue(value ?? '', true)
        setDisplayValue(formattedValue.formated)
    }, [formatValue, onValueChange, safeDecimalLimit, value])

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        // get formatted input value
        const inputValue = e.target.value
        // current cursor position
        const cursorPos = e.target.selectionStart || 0

        // format the value
        const formattedValue = formatValue(inputValue)

        // trigger onValueChange
        if (onValueChange) onValueChange(formattedValue.raw, formattedValue.num, formattedValue.formated)
        if (onChange) onChange(e)

        setDisplayValue(formattedValue.formated)

        // adjust cursor position
        setTimeout(() => {
            if (inputRef.current) {
                let newCursorPos = cursorPos + (formattedValue.formated.length - inputValue.length)
                newCursorPos = Math.max(0, Math.min(newCursorPos, formattedValue.formated.length))
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
            }
        }, 0)
    }

    const handleBlur = () => {
        // on blur, ensure the value is properly formatted
        const formattedValue = formatValue(displayValue)
        setDisplayValue(formattedValue.formated)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()

            let current = value ? new Decimal(formatValue(value, true).raw).toNumber() : 0
            if (current > new Decimal(`1e${Decimal.maxE}`).toNumber() || current < new Decimal(`-1e${Decimal.maxE}`).toNumber()) {
                current = 0
            }

            const delta = step

            let next = new Decimal(current)
            if (e.key === 'ArrowUp') {
                next = next.plus(delta)
            } else {
                next = next.minus(delta)
            }

            if (min !== undefined) next = Decimal.max(next, min)
            if (max !== undefined) next = Decimal.min(next, max)

            if (!allowNegative) {
                next = Decimal.max(0, next)
            }

            const formattedNext = formatValue(next.toNumber(), true)

            setDisplayValue(formattedNext.formated)
            if (onValueChange) onValueChange(formattedNext.raw, formattedNext.num, formattedNext.formated)
        }
    }

    return <input id={id} name={name} type='text' ref={inputRef} value={displayValue} onChange={handleInput} onBlur={handleBlur} onKeyDown={handleKeyDown} placeholder={placeholder} className={className} {...rest} />
}

export default NumberInput
