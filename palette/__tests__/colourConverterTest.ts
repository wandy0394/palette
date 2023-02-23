import ColourConverter from "../src/model/colourConverter"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'


describe('Testing colour converter', ()=>{
    let converter = new ColourConverter()

    test('Test 1: FF0000', ()=>{
        let output = converter.rgb2hsv('FF0000') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":0, "saturation":1, "value":1})
    })
    test('Test 2: 00FF00', ()=>{
        let output = converter.rgb2hsv('00FF00') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":120, "saturation":1, "value":1})
    })
    test('Test 3: 0000FF', ()=>{
        let output = converter.rgb2hsv('0000FF') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":240, "saturation":1, "value":1})
    })
    test('Test 4: FFFFFF', ()=>{
        let output = converter.rgb2hsv('FFFFFF') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":0, "saturation":0, "value":1})
    })
    test('Test 5: 000000', ()=>{
        let output = converter.rgb2hsv('000000') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":0, "saturation":0, "value":0})
    })
    test('Test 6: FFFF00', ()=>{
        let output = converter.rgb2hsv('FFFF00') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":60, "saturation":1, "value":1})
    })
    test('Test 7: FF00FF', ()=>{
        let output = converter.rgb2hsv('FF00FF') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":300, "saturation":1, "value":1})
    })
    test('Test 8: 00FFFF', ()=>{
        let output = converter.rgb2hsv('00FFFF') 
        expect(output).not.toEqual(null)
        expect(output).toEqual({"hue":180, "saturation":1, "value":1})
    })
    test('Test 9: 808040', ()=>{
        let output = converter.rgb2hsv('808040') 
        expect(output).not.toEqual(null)
        expect(output!.hue).toBeCloseTo(60)
        expect(output!.saturation).toBeCloseTo(0.5)
        expect(output!.value).toBeCloseTo(0.5)
    })
    test('Test 10: 000080', ()=>{
        let output = converter.rgb2hsv('000080') 
        expect(output).not.toEqual(null)
        expect(output!.hue).toBeCloseTo(240)
        expect(output!.saturation).toBeCloseTo(1)
        expect(output!.value).toBeCloseTo(0.5)
    })
    test('Test 10: 808080', ()=>{
        let output = converter.rgb2hsv('808080') 
        expect(output).not.toEqual(null)
        expect(output!.hue).toBeCloseTo(0)
        expect(output!.saturation).toBeCloseTo(0)
        expect(output!.value).toBeCloseTo(0.502)
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