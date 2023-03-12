import { Reducer, useReducer } from "react";
import ColourConverter from "../model/colourConverter";
import { rgb2cartesian } from "../model/common/utils";
import { Colour, Palette } from "../types/colours";

export enum ACTION_TYPES {
    UPDATE_MAINCOLOUR ='UPDATE_MAINCOLOUR',
    UPDATE_ACCENTCOLOUR = 'UPDATE_ACCENTCOLOUR',
    UPDATE_SUPPORTCOLOUR='UPDATE_SUPPORTCOLOUR',
    UPDATE_COLOURVERTICIES = 'UPDATE_COLOURVERTICIES',
    INITIALISE_MAINCOLOUR='INITIALISE_MAINCOLOUR',
    UPDATE_COLOUR='UPDATE_COLOUR',
    SET_PALETTE='SET_PALETTE',
    INITIALISE='INITIALISE'
}

export type ColourAction = {
    type:ACTION_TYPES,
    payload: {
        palette?:Palette,
        colour?:Colour,
        index?:number,
        role?:ACTION_TYPES
    }
}

export type ColourState = {
    palette:Palette
    colour:Colour
    role:ACTION_TYPES
    index:number
}

export function useChosenColour(initialState:ColourState):[ColourState, React.Dispatch<ColourAction>] {
    const [chosenColour, dispatch] = useReducer(reducer, initialState)

    function reducer(state:ColourState, action:ColourAction):ColourState {
        const {type, payload} = action
        let newPalette:Palette, newState:ColourState
        switch(type) {
            case ACTION_TYPES.UPDATE_MAINCOLOUR:
                if (payload.colour && payload.index !== undefined) {
                    newPalette = updateMainColour(state, payload.colour, payload.index)
                    newState = {
                        palette:newPalette,
                        colour:payload.colour,
                        role:ACTION_TYPES.UPDATE_MAINCOLOUR,
                        index:payload.index
                    }
                    return newState
                }
                return state
                
            case ACTION_TYPES.UPDATE_ACCENTCOLOUR:
                if (payload.colour && payload.index !== undefined) {
                    newPalette = updateAccentColour(state, payload.colour, payload.index)
                    newState = {
                        palette:newPalette,
                        colour:payload.colour,
                        role:ACTION_TYPES.UPDATE_ACCENTCOLOUR,
                        index:payload.index
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.UPDATE_SUPPORTCOLOUR:
                if (payload.colour && payload.index !== undefined) {

                    newPalette = updateSupportColour(state, payload.colour, payload.index)
                    newState = {
                        palette:newPalette,
                        colour:payload.colour,
                        role:ACTION_TYPES.UPDATE_SUPPORTCOLOUR,
                        index:payload.index
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.UPDATE_COLOURVERTICIES:
                if (payload.colour && payload.index !== undefined) {

                    newPalette = updateSupportColour(state, payload.colour, payload.index)
                    newState = {
                        palette:newPalette,
                        colour:payload.colour,
                        role:ACTION_TYPES.UPDATE_SUPPORTCOLOUR,
                        index:payload.index
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.INITIALISE_MAINCOLOUR: 
                if (payload.colour) {

                    newState = {
                        ...state,
                        colour:payload.colour,
                        role:ACTION_TYPES.UPDATE_MAINCOLOUR
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.UPDATE_COLOUR:
                if (payload.colour) {
                    newState = {
                        ...state,
                        colour:payload.colour
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.SET_PALETTE:
                if (payload.palette) {
                    newState = {
                        ...state,
                        palette:payload.palette
                    }
                    return newState
                }
                return state
            case ACTION_TYPES.INITIALISE:
                if (payload.palette && payload.colour && payload.index !== undefined && payload.role) {
                    newState = {
                        palette:payload.palette,
                        colour:payload.colour,
                        role:payload.role,
                        index:payload.index
                    }
                    return newState
                }
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
    }
    function updateAccentColour(state:ColourState, colour:Colour, index:number):Palette {
        let newPalette:Palette = {...state.palette}
        for (let i = 0; i < newPalette.colourVerticies.length; i++) {
            if (state.palette.accentColours[index].rgb === newPalette.colourVerticies[i].rgb) {
                newPalette.colourVerticies[i] = colour
                break
            }
        }
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.accentColours.length) 
                newPalette.accentColours[index] = colour

        return newPalette
    }
    function updateSupportColour(state:ColourState, colour:Colour, index:number) {
        let newPalette:Palette = {...state.palette}
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.supportColours.length) 
                newPalette.supportColours[index] = colour
        return newPalette
    }
    function updateColourVerticies(state:ColourState, colour:Colour, index:number):Palette {
        let newPalette:Palette = {...state.palette}
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.colourVerticies.length) 
                newPalette.colourVerticies[index] = colour

        return newPalette
    }

    return [chosenColour, dispatch as React.Dispatch<ColourAction>]
}