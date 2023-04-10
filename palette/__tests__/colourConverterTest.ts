import ColourConverter from "../src/model/colourConverter"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'


describe('Testing rgb2hsv converter', ()=>{
    let converter = new ColourConverter()

    test('Test 1: FF0000', ()=>{
        let output = converter.rgb2hsv('FF0000') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":0, "saturation":1, "value":1})
    })
    test('Test 2: 00FF00', ()=>{
        let output = converter.rgb2hsv('00FF00') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":120, "saturation":1, "value":1})
    })
    test('Test 3: 0000FF', ()=>{
        let output = converter.rgb2hsv('0000FF') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":240, "saturation":1, "value":1})
    })
    test('Test 4: FFFFFF', ()=>{
        let output = converter.rgb2hsv('FFFFFF') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":0, "saturation":0, "value":1})
    })
    test('Test 5: 000000', ()=>{
        let output = converter.rgb2hsv('000000') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":0, "saturation":0, "value":0})
    })
    test('Test 6: FFFF00', ()=>{
        let output = converter.rgb2hsv('FFFF00') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":60, "saturation":1, "value":1})
    })
    test('Test 7: FF00FF', ()=>{
        let output = converter.rgb2hsv('FF00FF') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":300, "saturation":1, "value":1})
    })
    test('Test 8: 00FFFF', ()=>{
        let output = converter.rgb2hsv('00FFFF') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual({"hue":180, "saturation":1, "value":1})
    })
    test('Test 9: 808040', ()=>{
        let output = converter.rgb2hsv('808040') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) {
            expect(output.value.hue).toBeCloseTo(60)
            expect(output.value.saturation).toBeCloseTo(0.5)
            expect(output.value.value).toBeCloseTo(0.5)
        }
    })
    test('Test 10: 000080', ()=>{
        let output = converter.rgb2hsv('000080') 
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) {
            expect(output.value.hue).toBeCloseTo(240)
            expect(output.value.saturation).toBeCloseTo(1)
            expect(output.value.value).toBeCloseTo(0.5)
        }
    })
    test('Test 10: 808080', ()=>{
        let output = converter.rgb2hsv('808080')
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) {
            expect(output.value.hue).toBeCloseTo(0)
            expect(output.value.saturation).toBeCloseTo(0)
            expect(output.value.value).toBeCloseTo(0.502)
        }
    })
})


describe('Testing hsv2rgb converter', ()=>{
    const converter = new ColourConverter()
    test('Test 1: (0, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:1, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('ff0000')
    })
    test('Test 2: (60, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:60, saturation:1, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('ffff00')
    })
    test('Test 3: (120, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:120, saturation:1, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('00ff00')
    })
    test('Test 4: (240, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:240, saturation:1, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('0000ff')
    })
    test('Test 5: (300, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:300, saturation:1, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('ff00ff')
    })
    test('Test 6: (0, 1, 0.5)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:1, value:0.5})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('800000')
    })
    test('Test 7: (60, 0.75, 0.5)', ()=>{
        let output = converter.hsv2rgb({hue:60, saturation:0.75, value:0.5})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('808020')
    })
    test('Test 8: (20, 0.2, 0.4)', ()=>{
        let output = converter.hsv2rgb({hue:20, saturation:0.2, value:0.4})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('665852')
    })
    test('Test 9: (0, 0, 1)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:0, value:1})
        expect(output.isSuccess()).toEqual(true)
        if (output.isSuccess()) expect(output.value).toEqual('ffffff')
    })
    test('Test 10: (-5, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:-5, saturation:1, value:1})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
    test('Test 11: (400, 1, 1)', ()=>{
        let output = converter.hsv2rgb({hue:400, saturation:1, value:1})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
    test('Test 12: (0, 2, 1)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:2, value:1})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
    test('Test 13: (0, 1, 2)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:1, value:2})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
    test('Test 14: (0, -2, 1)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:-2, value:1})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
    test('Test 15: (0, 1, -2)', ()=>{
        let output = converter.hsv2rgb({hue:0, saturation:1, value:-2})
        expect(output.isError()).toEqual(true)
        if (output.isError()) expect(output.error).toEqual('Input properties out of range.')
    })
})


describe("Testing rgb parser", ()=>{
    const converter = new ColourConverter()
    test('Test 1: 123456', ()=>{
        let output = converter.isValidRGB('123456')
        expect(output).toEqual(true)
    })
    test('Test 2: ABCDEF', ()=>{
        let output = converter.isValidRGB('ABCDEF')
        expect(output).toEqual(true)
    })
    test('Test 3: AGCDEF', ()=>{
        let output = converter.isValidRGB('AGCDEF')
        expect(output).toEqual(false)
    })
    test('Test 4: 12345!', ()=>{
        let output = converter.isValidRGB('12345!')
        expect(output).toEqual(false)
    })
    test('Test 5: A', ()=>{
        let output = converter.isValidRGB('A')
        expect(output).toEqual(false)
    })
    test('Test 6: 1234567', ()=>{
        let output = converter.isValidRGB('1234567')
        expect(output).toEqual(false)
    })
    test('Test 7: (null)', ()=>{
        let output = converter.isValidRGB('')
        expect(output).toEqual(false)
    })
    test('Test 8: abcdef', ()=>{
        let output = converter.isValidRGB('abcedf')
        expect(output).toEqual(true)
    })
})