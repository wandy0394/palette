import ColourConverter from "../src/model/colourConverter"
import ComplementarySchemeGenerator from "../src/model/ComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../src/model/TriadicSchemeGenerator"
import TetraticSchemeGenerator from "../src/model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../src/model/SquareSchemeGenerator"
import SplitComplementarySchemeGenerator from "../src/model/SplitComplementarySchemeGenerator"
import AnalogousSchemeGenerator from "../src/model/AnalogousSchemeGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'
describe('Testing Palette Generator - Square', ()=>{
    let palette = new SquareSchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateColourVerticies('FF0000')
        let output0 = [
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'80ff00',
                hsv:{
                    hue:90,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'8000ff',
                hsv:{
                    hue:270,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'00ffff',
                hsv:{
                    hue:180,
                    saturation:1,
                    value:1,
                }
            },
        ]
  
        expect(output).toEqual([output0])

    })

    test('Test 2: 000000', ()=>{
        let output = palette.generateColourVerticies('000000')
        let output0 = [
            {
                rgb:'000000',
                hsv:{
                    hue:0,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:180,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:90,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:270,
                    saturation:0,
                    value:0,
                }
            },
        ]
  
        expect(output).toEqual([output0])
    })

    test('Test 3: FFFFFF', ()=>{
        let output = palette.generateColourVerticies('FFFFFF')
        let output0 = [
            {
                rgb:'ffffff',
                hsv:{
                    hue:0,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:180,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:90,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:270,
                    saturation:0,
                    value:1,
                }
            },
        ]
  
        expect(output).toEqual([output0])
        // expect(output).toEqual([['ffffff', 'ffffff', 'ffffff', 'ffffff']])
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateColourVerticies('!FFFFF')
        expect(output).toEqual([[]])
    })
})