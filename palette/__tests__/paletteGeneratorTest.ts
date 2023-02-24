import ColourConverter from "../src/model/colourConverter"
import ComplementarySchemeGenerator from "../src/model/ComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../src/model/TriadicSchemeGenerator"
import TetraticSchemeGenerator from "../src/model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../src/model/SquareSchemeGenerator"
import SplitComplementarySchemeGenerator from "../src/model/SplitComplementarySchemeGenerator"
import AnalogousSchemeGenerator from "../src/model/AnalogousSchemeGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'

describe('Testing Palette Generator - Complementary', ()=>{
    let palette = new ComplementarySchemeGenerator(new ColourConverter())
    test('Test 1: FF0000->ffff', ()=>{
        let rgb = 'FF0000'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ff0000', '00ffff']])
    })
    test('Test 2: 00FF00->ff00ff', ()=>{
        let rgb = '00FF00'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ff00ff', '00ff00']])
    })
    test('Test 3: 0000FF->ffff00', ()=>{
        let rgb = '0000FF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffff00', '0000ff']])
    })
    test('Test 4: 000000->000000', ()=>{
        let rgb = '000000'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['000000', '000000']])
    })
    test('Test 5: FFFFFF->ffffff', ()=>{
        let rgb = 'FFFFFF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffffff', 'ffffff']])
    })
    test('Test 6: FFFFF@->null', ()=>{
        let rgb = 'FFFFF@'
        let output = palette.generateScheme(rgb)
        expect(output).toEqual({schemes:[[]]})
    })
})

describe('Testing Palette Generator - Triadic', ()=>{
    let palette = new TriadicSchemeGenerator(new ColourConverter())
    test('Test 1: FF0000', ()=>{
        let rgb = 'FF0000'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ff0000', '00ff00', '0000ff']])
    })
    test('Test 2: 00FF00', ()=>{
        let rgb = '00FF00'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ff0000', '00ff00', '0000ff']])
    })
    test('Test 3: 0000FF', ()=>{
        let rgb = '0000FF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ff0000', '00ff00', '0000ff']])
    })
    test('Test 4: 000000', ()=>{
        let rgb = '000000'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['000000', '000000', '000000']])
    })
    test('Test 5: FFFFFF', ()=>{
        let rgb = 'FFFFFF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffffff', 'ffffff', 'ffffff']])
    })
    test('Test 6: FF00FF', ()=>{
        let rgb = 'FF00FF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffff00', 'ff00ff', '00ffff']])
    })
    test('Test 7: FFFF00', ()=>{
        let rgb = 'FFFF00'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffff00', 'ff00ff', '00ffff']])
    })
    test('Test 8: 00FFFF', ()=>{
        let rgb = '00FFFF'
        let output = palette.generateScheme(rgb)
        expect(output?.schemes).toEqual([['ffff00', 'ff00ff', '00ffff']])
    })
})

  describe('Testing Palette Generator - Split Complementary', ()=>{
    let palette = new SplitComplementarySchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateScheme('FF0000')
        expect(output?.schemes).toEqual([
            ['ff0000', '00ffbf', '00bfff'], 
            ['ff8000', 'ff0000', '00bfff'], 
            ['ff0080', 'ff0000', '00ffbf']
        ])
    })

    test('Test 2: 000000', ()=>{
        let output = palette.generateScheme('000000')
        expect(output?.schemes).toEqual([
            ['000000', '000000', '000000'], 
            ['000000', '000000', '000000'], 
            ['000000', '000000', '000000']
        ])
    })

    test('Test 3: FFFFFF', ()=>{
        let output = palette.generateScheme('FFFFFF')
        expect(output?.schemes).toEqual([
            ['ffffff', 'ffffff', 'ffffff'], 
            ['ffffff', 'ffffff', 'ffffff'], 
            ['ffffff', 'ffffff', 'ffffff']
        ])
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateScheme('!FFFFF')
        expect(output).toEqual({schemes:[[]]})
    })
})

  describe('Testing Palette Generator - Analogous', ()=>{
    let palette = new AnalogousSchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateScheme('FF0000')
        expect(output?.schemes).toEqual([
            ['ff4000', 'ff0040', 'ff0000'], 
            ['ff8000', 'ff4000', 'ff0000'], 
            ['ff0080', 'ff0040', 'ff0000']
        ])
    })

    test('Test 2: 000000', ()=>{
        let output = palette.generateScheme('000000')
        expect(output?.schemes).toEqual([
            ['000000', '000000', '000000'], 
            ['000000', '000000', '000000'], 
            ['000000', '000000', '000000']
        ])
    })

    test('Test 3: FFFFFF', ()=>{
        let output = palette.generateScheme('FFFFFF')
        expect(output?.schemes).toEqual([
            ['ffffff', 'ffffff', 'ffffff'], 
            ['ffffff', 'ffffff', 'ffffff'], 
            ['ffffff', 'ffffff', 'ffffff']
        ])
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateScheme('!FFFFF')
        expect(output).toEqual({schemes:[[]]})
    })
})

  describe('Testing Palette Generator - Square', ()=>{
    let palette = new SquareSchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateScheme('FF0000')
        expect(output?.schemes).toEqual([['ff0000', '80ff00', '8000ff', '00ffff']])
    })

    test('Test 2: 000000', ()=>{
        let output = palette.generateScheme('000000')
        expect(output?.schemes).toEqual([['000000', '000000', '000000', '000000']])
    })

    test('Test 3: FFFFFF', ()=>{
        let output = palette.generateScheme('FFFFFF')
        expect(output?.schemes).toEqual([['ffffff', 'ffffff', 'ffffff', 'ffffff']])
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateScheme('!FFFFF')
        expect(output).toEqual({schemes:[[]]})
    })
})

  describe('Testing Palette Generator - Tetratic', ()=>{
    let palette = new TetraticSchemeGenerator(new ColourConverter())

    test('Test 1: FF0000', ()=>{
        let output = palette.generateScheme('FF0000')
        expect(output?.schemes).toEqual([
            ['ff8000', 'ff0000', '00ffff', '0080ff'], 
            ['ff0080', 'ff0000', '00ffff', '00ff80'], 
        ])
    })

    test('Test 2: 000000', ()=>{
        let output = palette.generateScheme('000000')
        expect(output?.schemes).toEqual([
            ['000000', '000000', '000000', '000000'], 
            ['000000', '000000', '000000', '000000'], 
        ])
    })

    test('Test 3: FFFFFF', ()=>{
        let output = palette.generateScheme('FFFFFF')
        expect(output?.schemes).toEqual([
            ['ffffff', 'ffffff', 'ffffff', 'ffffff'], 
            ['ffffff', 'ffffff', 'ffffff', 'ffffff'], 
        ])
    })
    test('Test 4: !FFFFF', ()=>{
        let output = palette.generateScheme('!FFFFF')
        expect(output).toEqual({schemes:[[]]})
    })
})