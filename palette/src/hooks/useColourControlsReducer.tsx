import { useReducer } from 'react'
import { AlertType } from '../components/common/AlertBox'
import { Point } from '../types/cartesian'


export type ColourControlsState = {
    wheelWidth:number,
    handleWidth:number,
    handlePosition:Point,
    sliderValue:number
}

export enum COLOUR_CONTROLS_ACTION_TYPE {
    SET_HANDLE_POSITION='SET_HANDLE_POSITION',
    SET_WHEEL_WIDTH='SET_WHEEL_WIDTH',
    SET_HANDLE_WIDTH='SET_HANDLE_WIDTH',
    SET_SLIDER_VALUE='SET_SLIDER_VALUE'
}


export type ColourControlsAction = {
    type:COLOUR_CONTROLS_ACTION_TYPE
    payload: {
        wheelWidth?:number,
        handleWidth?:number,
        handlePosition?:Point,
        sliderValue?:number
    }
}

export default function useColourControlsReducer(initialState:ColourControlsState):[ColourControlsState, React.Dispatch<ColourControlsAction>] {
    
    const [state, dispatch] = useReducer(reducer, initialState)

    function reducer(state:ColourControlsState, action:ColourControlsAction):ColourControlsState {
        const {type, payload} = action

        switch(type) {
            case COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_POSITION:
                if (payload.handlePosition) {
                    return {
                        ...state,
                        handlePosition:payload.handlePosition
                    }
                }
                return state
            case COLOUR_CONTROLS_ACTION_TYPE.SET_WHEEL_WIDTH:
                if (payload.wheelWidth) {
                    return {
                        ...state,
                        wheelWidth:payload.wheelWidth
                    }
                }
                return state
            case COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_WIDTH:
                if (payload.handleWidth) {
                    return {
                        ...state,
                        handleWidth:payload.handleWidth
                    }
                }
                return state
            case COLOUR_CONTROLS_ACTION_TYPE.SET_SLIDER_VALUE:
                if (payload.sliderValue) {
                    return {
                        ...state,
                        sliderValue:payload.sliderValue
                    }
                }
                return state
            default:
                return state
        }

    }

    return [state, dispatch]
}