const initialState = {
    requestData: ''
}

export type InitialStateType = typeof initialState

export const requestReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'request/SET-REQUEST-PAYLOAD':
            return {
                ...state,
                requestData: action.value
            }
        default:
            return state
    }
}

// actions
export const setRequestPayloadAC = (value: string) =>
    ({type: 'request/SET-REQUEST-PAYLOAD', value} as const)



export type ActionsType = ReturnType<typeof setRequestPayloadAC>
