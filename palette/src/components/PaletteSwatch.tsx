import { Palette, Scheme } from "../types/colours"
import ColouredBar from "./ColouredBar"
import ColouredSquare from "./ColouredSquare"

type Props = {
    palette: Palette
}

export default function PaletteSwatch(props:Props) {
    const{palette} = props
    return (
        <div className='w-full grid grid-rows-2 h-full'>
            
            <div className='w-full grid grid-cols-2 border border-solid border-red-500'>
                <div className='w-full items-center justify-center'>
                    <div className='flex flex-col gap-4 w-full h-full items-center'>
                        <ColouredBar colour={palette.mainColour.rgb}/>
                        {/* <div className='prose-xl'>#{palette.mainColour.rgb}</div> */}
                    </div>
                </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette &&
                        palette.accentColours.map((colour, index)=>{
                            return (
                                <div key={`accent-${index}`} className='flex flex-col gap-0 w-full h-full items-center'>
                                    <ColouredBar colour={colour.rgb}/>
                                    {/* <div className='prose-xl'>#{colour.rgb}</div> */}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className='w-full flex items-center justify-center'>
                {
                    palette &&
                    palette.supportColours.map((colour, index)=>{
                        return (
                            <div key={`support-${index}`} className='flex flex-col gap-4 w-full h-full items-center'>
                                <ColouredBar colour={colour.rgb}/>
                                {/* <div className='prose-xl'>#{colour.rgb}</div> */}
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}