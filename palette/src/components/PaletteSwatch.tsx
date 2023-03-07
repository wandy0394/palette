import { Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"

type Props = {
    palette: Scheme
}

export default function PaletteSwatch(props:Props) {
    const{palette} = props
    return (
        <div className='w-full flex items-center justify-center gap-8 h-full flex-wrap'>
            {
                palette?.palette.map(colour=>{
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