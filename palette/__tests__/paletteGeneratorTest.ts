import ColourConverter from "../src/model/colourConverter"
import PaletteGenerator from "../src/model/paletteGenerator"
import { describe } from "node:test"
import {test, expect} from '@jest/globals'

describe('Testing Palette Generator', ()=>{
    let converter = new ColourConverter()
    let palette = new PaletteGenerator(converter)
    test('Test 1: ', ()=>{

    })
})