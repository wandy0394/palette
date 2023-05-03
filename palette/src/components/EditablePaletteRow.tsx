import { useCallback, useRef, useState } from "react"
import { HEX, Palette, Scheme } from "../types/colours"
import ColouredBar from "./ColouredBar"
import ColouredSquare from "./ColouredSquare"
import ErrorBoundary from "./ErrorBoundary"
import { HexColorPicker } from "react-colorful"
import useOnClickOutside from "../hooks/useClickOutside"
import { ACTION_TYPES, PaletteAction } from "../hooks/usePaletteEditorReducer"
import { createColour } from "../model/common/utils"

type Props = {
    palette: Palette
    paletteDispatch:React.Dispatch<PaletteAction>
}

type EditableColouredBarProps = {
    colour:HEX    
    setColour:(rgb:HEX) => void
}

function EditableColouredBar(props:EditableColouredBarProps) {
    const {colour, setColour} = props
    const [visible, setVisible] = useState<boolean>(false)
    const hide = useCallback(()=>{
        setVisible(false)
    }, [])
    const popover = useRef<HTMLDivElement>(null)
    useOnClickOutside(popover, hide)
    return (
        <>
            <div className='w-full h-full relative'>
                <ColouredBar colour={colour} onSelect={()=>setVisible(true)} hover={true}/>
                {
                    visible?
                    <div className='absolute -top-72' ref={popover}>
                        <HexColorPicker color={colour} onChange={(e)=>setColour(e.slice(1, e.length))}/>
                    </div>
                    :null        
                    
                }
            </div>
        </>
    )
}

export default function EditablePaletteRow(props:Props) {
    const{palette, paletteDispatch} = props

    function handleSetColour(rgb:HEX) {
        //should usePaletteEditorReducer() in parent
        paletteDispatch({type:ACTION_TYPES.UPDATE_MAINCOLOUR, payload:{colour:createColour(rgb), index:0}})
    }

    return (
        <ErrorBoundary>
            <div className='w-full grid grid-rows-1 h-full'>
                <div className='w-full grid grid-cols-3'>
                    <div className='w-full items-center justify-center'>
                        <div className='flex flex-col gap-4 w-full h-full items-center'>
                            {/* <ColouredBar colour={palette.mainColour.rgb}/> */}
                            <EditableColouredBar 
                                colour={palette.mainColour.rgb} 
                                setColour={
                                    (rgb:HEX)=>paletteDispatch({
                                        type:ACTION_TYPES.UPDATE_MAINCOLOUR, 
                                        payload:{
                                            colour:createColour(rgb), 
                                            index:0
                                        }
                                    })
                                }
                            />
                            
                        </div>
                    </div>
                    <div className='w-full flex items-center justify-center'>
                        {
                            palette &&
                            palette.accentColours.map((colour, index)=>{
                                return (
                                    <div key={`accent-${index}`} className='flex flex-col gap-0 w-full h-full items-center'>
                                        {/* <ColouredBar colour={colour.rgb}/> */}
                                        <EditableColouredBar 
                                            colour={colour.rgb} 
                                            setColour={
                                                (rgb:HEX)=>paletteDispatch({
                                                    type:ACTION_TYPES.UPDATE_ACCENTCOLOUR, 
                                                    payload:{
                                                        colour:createColour(rgb), 
                                                        index:index
                                                    }
                                                })
                                            }
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette &&
                        palette.supportColours.map((colour, index)=>{
                            return (
                                <div key={`support-${index}`} className='flex flex-col gap-4 w-full h-full items-center'>
                                    {/* <ColouredBar colour={colour.rgb}/> */}
                                    <EditableColouredBar 
                                            colour={colour.rgb} 
                                            setColour={
                                                (rgb:HEX)=>paletteDispatch({
                                                    type:ACTION_TYPES.UPDATE_SUPPORTCOLOUR, 
                                                    payload:{
                                                        colour:createColour(rgb), 
                                                        index:index
                                                    }
                                                })
                                            }
                                        />
                                </div>
                            )
                        })
                    }
                </div>
                </div>

            </div>
        </ErrorBoundary>
    )
}