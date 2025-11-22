import {cleanup, render, screen, fireEvent} from '@testing-library/react'
import {afterEach, describe, it, expect} from 'vitest'
import { NumberInput } from '../components/NumberInput'

describe('NumberInput test:', () => {
    afterEach(cleanup)

    // state to hold the value
    let price: string = '1233.456'

    const setPrice = (value: string) => {
        price = value
    }


    it('should render component', () => {
        render(<NumberInput
            role={'textbox'}
            aria-label="Number input"
            value={price}
            onValueChange={(value:string, num: number, formated:string) => {
                console.log(`value: ${value}, num: ${num}, formated: ${formated}`)
                setPrice(value)
            }}
            decimalLimit={3}
            thousandSeparator=','
            decimalSeparator='.'
            allowNegative={true}
            placeholder='Enter a number'
            style={{width: 200, fontSize: 16}}
            className={'border border-gray-300 rounded px-3 py-2'}
        />)

        const input = screen.getByRole('textbox', {name: 'Number input'}) as HTMLInputElement
        expect(input).toBeInTheDocument()
        expect(input.value).toBe('1,233.456')

        // Simulate user typing a number
        fireEvent.change(input, { target: { value: '1234.567' } })
        expect(input.value).toBe('1,234.567')

    })

})