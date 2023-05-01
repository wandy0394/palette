import { useEffect, useRef, useState } from "react"
import p5 from 'p5'
import ContentBox from "../components/common/ContentBox"
import tiles from "../artworks/tiles"
import patchwork from "../artworks/patchwork"
import faces from "../artworks/faces"
import wetpaint from "../artworks/wetpaint"
import flowers from "../artworks/flowers"
import { Colour, HEX, Palette } from "../types/colours"
import PaletteSwatch from "../components/PaletteSwatch"
import { useLocation } from "react-router-dom"
import PaletteRow from "../components/PaletteRow"
import { ArtworkProps } from "../artworks/utils/types"
import LibraryModal from "../components/LibraryModal"
import TriadicSchemeGenerator from "../model/TriadicSchemeGenerator"
import ColourConverter from "../model/colourConverter"
import { Result } from "../model/common/error"
import TetraticSchemeGenerator from "../model/TetraticSchemeGenerator"
import AnalogousSchemeGenerator from "../model/AnalogousSchemeGenerator"
import SplitComplementarySchemeGenerator from "../model/SplitComplementarySchemeGenerator"
import SquareSchemeGenerator from "../model/SquareSchemeGenerator"
import ComplementarySchemeGenerator from "../model/ComplementarySchemeGenerator"

type Artworks = {
    [key:string]:{
        id:string,
        art:(props:ArtworkProps)=>void,
        label:string
    }
}

const artworks:Artworks = {
    tiles:{id:'tiles', art:tiles, label:'Tiles'},
    patchwork:{id:'patchwork', art:patchwork, label:'Patchwork'},
    faces:{id:'faces', art:faces, label:'Faces'},
    wetpaint:{id:'wetpaint', art:wetpaint, label:'Wet Paint'},
    flowers:{id:'flowers', art:flowers, label:'Flowers'}
}
const emptyPalette:Palette = {
    mainColour:{
        rgb:'000000',
        hsv:{
            hue:0,
            saturation:0,
            value:0
        }
    },
    colourVerticies:[],
    accentColours:[],
    supportColours:[]
}

function getRandomPalette():Palette {

    let cc = new ColourConverter()
    let generators = [
        new TriadicSchemeGenerator(cc),
        new TetraticSchemeGenerator(cc),
        new AnalogousSchemeGenerator(cc),
        new SplitComplementarySchemeGenerator(cc),
        new SquareSchemeGenerator(cc),
        new ComplementarySchemeGenerator(cc)
    ]

    let generator = generators[Math.floor(Math.random() * (generators.length-1))]
    let palette:Palette = emptyPalette
    let rgb:HEX = '349594'
    let result:Result<Colour[][], string> = generator.generateColourVerticies(rgb)
    if (result.isSuccess()) {
        let paletteResult:Result<Palette, string> = generator.generatePalette(rgb, result.value[Math.floor(Math.random() * (result.value.length-1))])
        if (paletteResult.isSuccess()) {
            palette = paletteResult.value
        }
    }
    return palette
}

export default function Visualiser() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [artwork, setArtwork] = useState<p5>()
    const [artSelect, setArtSelect] = useState<string>('tiles')
    const [palette, setPalette] = useState<Palette>(emptyPalette)
    const [modalVisible, setModalVisible] = useState<boolean>(false)

    const location = useLocation()


    function drawArtwork(p:p5) {
        if (artSelect) {
            artworks[artSelect].art({p:p, palette:palette, dim:[600,600]})
        }
    }

    function handleRegenerate() {
        if (canvasRef.current) {
            artwork?.noCanvas()
            let myp5:p5 = new p5(drawArtwork, canvasRef.current)
            setArtwork(myp5)
        }
    }

    let called = false
    useEffect(()=>{
        console.log('mounted')
        console.log(called)
        console.log(canvasRef.current)
        console.log(location.state)
        if (!called && 
            canvasRef.current && 
            (location.state === null || location.state === undefined)) {

            console.log('yes')
            let palette:Palette = getRandomPalette()
            setPalette(palette)
            called = true
        }
    }, [canvasRef.current])

    //update palette and harmony if location.state is set
    useEffect(()=>{
        //assumes location.state is a Palette object. need to validate that
        if (location.state && location.state.mainColour.rgb) {
            setPalette(location.state)
        }
    }, [location])

    function loadPalette(palette:Palette) {
        setPalette(palette)
    }

    return (
        <ContentBox>
            <div className='w-full min-h-screen flex flex-col items-center gap-4'>
                <div className='flex items-center justify-center gap-4 py-4'>
                    <div>
                        <select className='select select-primary w-full text-xl' value={artSelect} onChange={(e)=>setArtSelect(e.target.value)}>
                            <option disabled selected>Choose an artwork</option>
                            {
                                (artworks !== undefined) &&
                                Object.keys(artworks).map((key)=>{
                                    return (
                                        <option key={key} id={artworks[key].id} value={key}>
                                            {artworks[key].label}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={handleRegenerate}>GENERATE ART</button>
                    <label htmlFor="library-modal" className="btn btn-secondary">Library</label>
                </div>
                <div ref = {canvasRef} />
                <div className='w-full h-48'>
                    <PaletteRow palette={palette}/>
                </div>
                <input type='checkbox' id='library-modal' className='modal-toggle'/>
                <label htmlFor='library-modal' className='h-full modal modal-bottom flex flex-col items-center justify-center'>
                    <label className='modal-box relative w-1/2 px-0 py-0 rounded-xl'>
                        <LibraryModal loadPaletteHandler={loadPalette}/>
                    </label>
                </label>
            </div>
        </ContentBox>
    )
}