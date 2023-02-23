import ColourConverter from "../src/model/colourConverter"
import PaletteGenerator from "../src/model/paletteGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'

describe('Testing Palette Generator', ()=>{
    let palette = new PaletteGenerator(new ColourConverter())
    test('Test 1: FF0000->ffff', ()=>{
        let rgb = 'FF0000'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(['ff0000', '00ffff'])
    })
    test('Test 2: 00FF00->ff00ff', ()=>{
        let rgb = '00FF00'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(['00ff00', 'ff00ff'])
    })
    test('Test 3: 0000FF->ffff00', ()=>{
        let rgb = '0000FF'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(['0000ff', 'ffff00'])
    })
    test('Test 4: 000000->000000', ()=>{
        let rgb = '000000'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(['000000', '000000'])
    })
    test('Test 5: FFFFFF->ffffff', ()=>{
        let rgb = 'FFFFFF'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(['ffffff', 'ffffff'])
    })
    test('Test 6: FFFFF@->null', ()=>{
        let rgb = 'FFFFF@'
        let output = palette.getComplentaryColourScheme(rgb)
        expect(output).toEqual(null)
    })
})