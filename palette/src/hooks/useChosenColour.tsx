import { Reducer, useReducer } from "react";
import { Colour, Palette } from "../types/colours";

export enum ACTION_TYPES {
    MAINCOLOUR ='MAINCOLOUR',
    ACCENTCOLOUR = 'ACCENTCOLOUR',
    SUPPORTCOLOUR='SUPPORTCOLOUR',
    COLOURVERTICIES = 'COLOURVERTICIES'
}

export type ColourAction = {
    type:ACTION_TYPES,
    payload: {
        colour:Colour,
        index:number
    }
}

type ColourState = {
    palette:Palette
    colour:Colour
    role:ACTION_TYPES
    index:number
}

export function useChosenColour(initialState:ColourState):[ColourState, React.Dispatch<ColourAction>] {
    // const initialState:Colour = {
    //     rgb:'',
    //     hsv:{
    //         hue:0,
    //         saturation:0,
    //         value:0,
    //     }
    // }
    // const [chosenColour, dispatch] = useReducer<(state:ColourState, action:ColourAction)=>ColourState>(reducer, initialState)
    const [chosenColour, dispatch] = useReducer(reducer, initialState)

    function reducer(state:ColourState, action:ColourAction):ColourState {
        const {type, payload} = action
        switch(type) {
            case ACTION_TYPES.MAINCOLOUR:
                const newPalette:Palette = updateMainColour(state, payload.colour, payload.index)
                const newState:ColourState = {
                    palette:newPalette,
                    colour:payload.colour,
                    role:ACTION_TYPES.MAINCOLOUR,
                    index:payload.index
                }
                return newState
            case ACTION_TYPES.ACCENTCOLOUR:
                console.log('accent')
                return state
            case ACTION_TYPES.SUPPORTCOLOUR:
                console.log('support')
                return state
            case ACTION_TYPES.COLOURVERTICIES:
                console.log('ColourVertices')
                return state
            default:
                return state

        }
    }

    function updateMainColour(state:ColourState, colour:Colour, index:number):Palette {
        let newPalette:Palette = {...state.palette}
        newPalette.mainColour = colour
        for (let i = 0; i < newPalette.colourVerticies.length; i++) {
            if (state.palette.mainColour.rgb === newPalette.colourVerticies[i].rgb) {
                newPalette.colourVerticies[i] = colour
                break
            }
        }
        return newPalette

        // setPalette(newPalette)
        // setChosenColour(colour)
        // setColours([colour.rgb])
        // setChosenColourRole('mainColour')
    }
    // function updateAccentColour(colour:Colour, index:number) {
    //     let newPalette:Palette = {...palette}
    //     for (let i = 0; i < newPalette.colourVerticies.length; i++) {
    //         if (palette.accentColours[index].rgb === newPalette.colourVerticies[i].rgb) {
    //             newPalette.colourVerticies[i] = colour
    //             break
    //         }
    //     }
    //     if (index !== undefined && 
    //         index >= 0 && 
    //         index < newPalette.accentColours.length) 
    //             newPalette.accentColours[index] = colour
    //     setPalette(newPalette)
    //     setChosenColour(colour)
    //     setChosenColourRole('accentColours')

    // }
    // function updateSupportColour(colour:Colour, index:number) {
    //     let newPalette:Palette = {...palette}
    //     if (index !== undefined && 
    //         index >= 0 && 
    //         index < newPalette.supportColours.length) 
    //             newPalette.supportColours[index] = colour
    //     setPalette(newPalette)
    //     setChosenColour(colour)
    //     setChosenColourRole('supportColours')
    // }
    // function updateColourVerticies(colour:Colour, index:number) {
    //     let newPalette:Palette = {...palette}
    //     if (index !== undefined && 
    //         index >= 0 && 
    //         index < newPalette.colourVerticies.length) 
    //             newPalette.colourVerticies[index] = colour
    //     setPalette(newPalette)
    //     setChosenColour(colour)
    //     setChosenColourRole('colourVerticies')
    // }

    return [chosenColour, dispatch as React.Dispatch<ColourAction>]
}