import { Palette, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"

type Props = {
    palette: Palette
}

export default function PaletteSwatch(props:Props) {
    const{palette} = props
    return (
        <div className='w-full flex items-center justify-center gap-8 h-full flex-wrap'>
            <div className='flex flex-col gap-4 w-1/12 items-center'>
                <ColouredSquare colour={palette.mainColour.rgb}/>
            <div className='prose-xl'>#{palette.mainColour.rgb}</div>
                        </div>
            
            Accents
            {
                palette &&
                palette.accentColours.map(colour=>{
                    return (
                        <div className='flex flex-col gap-4 w-1/12 items-center'>
                            <ColouredSquare colour={colour.rgb}/>
                            <div className='prose-xl'>#{colour.rgb}</div>
                        </div>
                    )
                })
            }
            Supports
            {
                palette &&
                palette.supportColours.map(colour=>{
                    return (
                        <div className='flex flex-col gap-4 w-1/12 items-center'>
                            <ColouredSquare colour={colour.rgb}/>
                            <div className='prose-xl'>#{colour.rgb}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}