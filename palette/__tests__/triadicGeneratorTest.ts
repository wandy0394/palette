import ColourConverter from "../src/model/colourConverter"
import ComplementarySchemeGenerator from "../src/model/ComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../src/model/TriadicSchemeGenerator"
import TetraticSchemeGenerator from "../src/model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../src/model/SquareSchemeGenerator"
import SplitComplementarySchemeGenerator from "../src/model/SplitComplementarySchemeGenerator"
import AnalogousSchemeGenerator from "../src/model/AnalogousSchemeGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'

describe('Testing Palette Generator - Triadic', ()=>{
    let palette = new TriadicSchemeGenerator(new ColourConverter())
    test('Test 1: FF0000', ()=>{
        let rgb = 'FF0000'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'00ff00',
                hsv:{
                    hue:120,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'0000ff',
                hsv:{
                    hue:240,
                    value:1,
                    saturation:1
                }
            }, 
        ]])
    })
    test('Test 2: 00FF00', ()=>{
        let rgb = '00FF00'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'00ff00',
                hsv:{
                    hue:120,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'0000ff',
                hsv:{
                    hue:240,
                    value:1,
                    saturation:1
                }
            }, 
        ]])
    })
    test('Test 3: 0000FF', ()=>{
        let rgb = '0000FF'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'ff0000',
                hsv:{
                    hue:0,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'00ff00',
                hsv:{
                    hue:120,
                    value:1,
                    saturation:1
                }
            }, 
            {
                rgb:'0000ff',
                hsv:{
                    hue:240,
                    value:1,
                    saturation:1
                }
            }, 
        
        ]])
    })
    test('Test 4: 000000', ()=>{
        let rgb = '000000'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'000000',
                hsv:{
                    hue:0,
                    saturation:0,
                    value:0
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:120,
                    saturation:0,
                    value:0
                }
            },
            {
                rgb:'000000',
                hsv:{
                    hue:240,
                    saturation:0,
                    value:0
                }
            }
        ]])
    })
    test('Test 5: FFFFFF', ()=>{
        let rgb = 'FFFFFF'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'ffffff',
                hsv:{
                    hue:0,
                    saturation:0,
                    value:1
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:120,
                    saturation:0,
                    value:1
                }
            },
            {
                rgb:'ffffff',
                hsv:{
                    hue:240,
                    saturation:0,
                    value:1
                }
            }
        ]])
    })
    test('Test 6: FF00FF', ()=>{
        let rgb = 'FF00FF'
        let output = palette.generateColourVerticies(rgb)
        expect(output).toEqual([[
            {
                rgb:'ffff00',
                hsv:{
                    hue:60,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'ff00ff',
                hsv:{
                    hue:300,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'00ffff',
                hsv:{
                    hue:180,
                    saturation:1,
                    value:1
                }
            }    
        ]])
    })
    test('Test 7: FFFF00', ()=>{
        let rgb = 'FFFF00'
        let output = palette.generateColourVerticies(rgb)
                expect(output).toEqual([[
            {
                rgb:'ffff00',
                hsv:{
                    hue:60,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'ff00ff',
                hsv:{
                    hue:300,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'00ffff',
                hsv:{
                    hue:180,
                    saturation:1,
                    value:1
                }
            }    
        ]])
    })
    test('Test 8: 00FFFF', ()=>{
        let rgb = '00FFFF'
        let output = palette.generateColourVerticies(rgb)
                expect(output).toEqual([[
            {
                rgb:'ffff00',
                hsv:{
                    hue:60,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'ff00ff',
                hsv:{
                    hue:300,
                    saturation:1,
                    value:1
                }
            },
            {
                rgb:'00ffff',
                hsv:{
                    hue:180,
                    saturation:1,
                    value:1
                }
            }    
        ]])
    })
})
