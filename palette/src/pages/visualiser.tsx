import { useEffect, useRef, useState } from "react"
import p5 from 'p5'
import ContentBox from "../components/common/ContentBox"
import tiles from "../artworks/tiles"
import patchwork from "../artworks/patchwork"
import faces from "../artworks/faces"
import wetpaint from "../artworks/wetpaint"
import flowers from "../artworks/flowers"
import { Palette } from "../types/colours"
import PaletteSwatch from "../components/PaletteSwatch"
import { useLocation } from "react-router-dom"
import PaletteRow from "../components/PaletteRow"

type Artworks = {
    [key:string]:{
        id:string,
        art:(p:p5, palette:Palette)=>void,
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
export default function Visualiser() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [artwork, setArtwork] = useState<p5>()
    const [artSelect, setArtSelect] = useState<string>('tiles')
    const [palette, setPalette] = useState<Palette>(emptyPalette)

    const location = useLocation()


    function drawArtwork(p:p5) {
        if (artSelect) {
            artworks[artSelect].art(p, palette)
        }
    }

    function handleRegenerate() {
        if (canvasRef.current) {
            artwork?.noCanvas()
            let myp5:p5 = new p5(drawArtwork, canvasRef.current)
            setArtwork(myp5)
        }
    }

    //update palette and harmony if location.state is set
    useEffect(()=>{
        //assumes location.state is a Palette object. need to validate that
        if (location.state && location.state.mainColour.rgb) {
            setPalette(location.state)
        }
    }, [location])

    return (
        <ContentBox>
            <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
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
                    <button className="btn btn-primary" onClick={handleRegenerate}>REGENERATE</button>
                </div>
                <div ref = {canvasRef} />
                <div className='w-full h-48'>
                    <PaletteRow palette={palette}/>

                </div>
            </div>
        </ContentBox>
    )
}