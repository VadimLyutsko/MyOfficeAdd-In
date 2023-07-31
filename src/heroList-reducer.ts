const initialState = {
    listItems: []
}
type InitialStateType = typeof initialState

export const heroListReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'heroList/SET-HEROLIST-PAYLOAD':
            return {
                ...state,
                listItems: [
                    {
                        icon: 'Ribbon',
                        primaryText: 'React работает олично, стоэйт прогружается',
                    },
                ]
            }
        // case 'login/SET-IS-LOGGED-IN':
        //     return {...state, isLoggedIn: action.value}
        // case 'login/SET-IS-INITIALIZED':
        //     return {...state, isInitialized: action.value}
        default:
            return state
    }
}

// actions
export const setHeroListPayloadAC = () =>
    ({type: 'heroList/SET-HEROLIST-PAYLOAD'} as const)

// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)
//
// export const setIsInitializedAC = (value: boolean) =>
//     ({type: 'login/SET-IS-INITIALIZED', value} as const)

// thunks
// export const loginTC = (data: FormDataType) => async (dispatch: Dispatch<ActionsType>) => {
//     dispatch(setAppStatusAC('loading'))
//     try {
//         const res = await authAPI.login(data)
//
//         if (res.data.resultCode === Result_Code.Ok) {
//             dispatch(setIsLoggedInAC(true))
//         } else {
//             handleServerAppError(res.data, dispatch);
//         }
//     } catch (err: any) {  //заглушка, чтобы не фонило
//         handleServerNetworkError(err, dispatch)
//     }
//     dispatch(setAppStatusAC('succeeded'))
// }
//
// export const initializeAppTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     authAPI.me().then(res => {
//         debugger
//         if (res.data.resultCode === Result_Code.Ok) {
//             dispatch(setIsLoggedInAC(true));
//             dispatch(setIsInitializedAC(true))
//             dispatch(setAppStatusAC('succeeded'))
//         } else {
//             dispatch(setIsInitializedAC(true))
//             handleServerAppError(res.data, dispatch);
//         }
//     }).catch(err => {
//         handleServerNetworkError(err, dispatch)
//     })
// }
//
// export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
//     dispatch(setAppStatusAC('loading'))
//     authAPI.logout()
//         .then(res => {
//             if (res.data.resultCode === Result_Code.Ok) {
//                 dispatch(setIsLoggedInAC(false))
//                 dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((err) => {
//             handleServerNetworkError(err, dispatch)
//         })
// }


// types
// type ActionsType =
//     ReturnType<typeof setIsInitializedAC>
//     | ReturnType<typeof setIsLoggedInAC>
//     | SetAppStatusActionType
//     | SetAppErrorActionType

export type ActionsType = ReturnType<typeof setHeroListPayloadAC>
