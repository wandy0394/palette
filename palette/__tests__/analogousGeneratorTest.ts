import ColourConverter from "../src/model/colourConverter"
import ComplementarySchemeGenerator from "../src/model/ComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../src/model/TriadicSchemeGenerator"
import TetraticSchemeGenerator from "../src/model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../src/model/SquareSchemeGenerator"
import SplitComplementarySchemeGenerator from "../src/model/SplitComplementarySchemeGenerator"
import AnalogousSchemeGenerator from "../src/model/AnalogousSchemeGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'


  describe('Testing Palette Generator - Analogous', ()=>{
    let palette = new AnalogousSchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateColourVerticies('FF0000')
        let output0 = [
            {
                rgb:'ff4000',
                hsv:{
                    hue:15,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff0040',
                hsv:{
                    hue:345,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    saturation:1,
                    value:1,
                }
            },
        ]
        let output1 = [
            {
                rgb:'ff8000',
                hsv:{
                    hue:30,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff4000',
                hsv:{
                    hue:15,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    saturation:1,
                    value:1,
                }
            },
        ]
        let output2 = [
            {
                rgb:'ff0080',
                hsv:{
                    hue:330,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff0040',
                hsv:{
                    hue:345,
                    saturation:1,
                    value:1,
                }
            },
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    saturation:1,
                    value:1,
                }
            },
        ]
        expect(output[0]).toEqual(output0)
        expect(output[1]).toEqual(output1)
        expect(output[2]).toEqual(output2)
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
                    hue:15,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:345,
                    saturation:0,
                    value:0,
                }
            },
        ]
        let output1 = [
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
                    hue:30,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:15,
                    saturation:0,
                    value:0,
                }
            },
        ]
        let output2 = [
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
                    hue:345,
                    saturation:0,
                    value:0,
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:330,
                    saturation:0,
                    value:0,
                }
            },
        ]
        expect(output[0]).toEqual(output0)
        expect(output[1]).toEqual(output1)
        expect(output[2]).toEqual(output2)        
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
                    hue:15,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:345,
                    saturation:0,
                    value:1,
                }
            },
        ]
        let output1 = [
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
                    hue:30,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:15,
                    saturation:0,
                    value:1,
                }
            },
        ]
        let output2 = [
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
                    hue:345,
                    saturation:0,
                    value:1,
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:330,
                    saturation:0,
                    value:1,
                }
            },
        ]
        expect(output[0]).toEqual(output0)
        expect(output[1]).toEqual(output1)
        expect(output[2]).toEqual(output2)
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateColourVerticies('!FFFFF')
        expect(output).toEqual([[]])
    })
})
