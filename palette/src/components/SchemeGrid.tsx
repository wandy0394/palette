import { HEX, SchemeOutput } from "../types/colours"
import ColouredSquare from "./ColouredSquare"

export default function SchemeGrid(props:{schemes:SchemeOutput}) {    
    const {schemes} = props
    return (
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            {
                (schemes !== null) && (
                    schemes.schemes.map(scheme=>{
                        return (
                            <div className='flex items-center gap-8 w-full rounded border border-neutral-500 py-4'>
                                {
                                    scheme.map(colour=>{
                                        return (
                                            <div className='flex flex-col gap-4 w-full items-center'>
                                                <ColouredSquare colour={colour}/>
                                                <div className='prose-xl'>#{colour}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                )
            }
        </div>
)
}