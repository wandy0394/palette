import { useEffect, useRef, useState } from "react"
import p5 from 'p5'
import ContentBox from "../components/common/ContentBox"
import tiles from "../artworks/tiles"
import mosaic from "../artworks/mosaic"
import patchwork from "../artworks/patchwork"
import faces from "../artworks/faces"
import wetpaint from "../artworks/wetpaint"
import flowers from "../artworks/flowers"

export default function Visualiser() {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [artwork, setArtwork] = useState<p5>()

    function drawArtwork(p:p5) {
        // tiles(p)
        // mosaic(p)
        // patchwork(p)
        // faces(p)
        // wetpaint(p)
        flowers(p)
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
                <button className="btn btn-primary" onClick={handleRegenerate}>REGENERATE</button>
            </div>
        </ContentBox>
    )
}