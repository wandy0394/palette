import { useEffect, useRef, useState } from "react"
import p5 from 'p5'
import ContentBox from "../components/common/ContentBox"
import tiles from "../artworks/tiles"
import patchwork from "../artworks/patchwork"
import faces from "../artworks/faces"
import wetpaint from "../artworks/wetpaint"
import flowers from "../artworks/flowers"

const artworks:any = {
    tiles:{id:'tiles', art:tiles, label:'Tiles'},
    patchwork:{id:'patchwork', art:patchwork, label:'Patchwork'},
    faces:{id:'faces', art:faces, label:'Faces'},
    wetpaint:{id:'wetpaint', art:wetpaint, label:'Wet Paint'},
    flowers:{id:'flowers', art:flowers, label:'Flowers'}
}

export default function Visualiser() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [artwork, setArtwork] = useState<p5>()
    const [artSelect, setArtSelect] = useState<string>('tiles')
    function drawArtwork(p:p5) {
        if (artSelect) {
            console.log(artSelect)
            artworks[artSelect].art(p)
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
        if (!called) {
            handleRegenerate()
        }
        return ()=>{
            called = true
        }
    }, [])

    return (
        <ContentBox>
            <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                <div>
                    ArtWork
                </div>
                <div ref = {canvasRef} />
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
        </ContentBox>
    )
}