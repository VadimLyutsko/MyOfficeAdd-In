import {Dispatch} from 'redux'
import {exampleCatAPI} from './someExample-api';

// const initialState: Array<TodolistDomainType> = []
const initialState: CatFactType =
    {
        fact: 'Initial Fact...',
        length: 252
    }

export const exampleCatReducer = (state: CatFactType = initialState, action: ActionsType): CatFactType => {
    switch (action.type) {
        case 'GET-JOKE':
            return {
                ...state,
                fact: action.catFact.fact,
                length: action.catFact.length
            }
        default:
            return state
    }
}


export type CatFactACActionType = ReturnType<typeof catFactAC>;


// actions
export const catFactAC = (catFact: { fact: string, length: number }) => ({
    type: 'GET-JOKE',
    catFact
} as const)

// thunks
export const fetchJokeTC = () => {
    return (dispatch: ThunkDispatch) => {
        exampleCatAPI.getCatData()
            .then((res) => {
                dispatch(catFactAC(res.data))
            }).catch(() => {
            dispatch(catFactAC(
                {
                    fact: 'ErrFuck',
                    length: 525
                }
            ))
        })
    }
}

// types
export type CatFactType = {
    fact: string
    length: number
}

type ActionsType = | CatFactACActionType

type ThunkDispatch = Dispatch<ActionsType>
