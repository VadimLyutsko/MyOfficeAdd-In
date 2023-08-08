import {Dispatch} from 'redux'
import {CreateCompletionResponseChoicesInner, CreateCompletionResponseUsage} from 'openai/api';
import {openai} from './openAI-api';


const initialState: GPTResponseType = {
    id: 'cmpl-7j8nKuhart1Qe3aML7ye71TZjKNRN',
    object: 'text_completion',
    created: 1690992922,
    model: 'text-davinci-003',
    choices: [
        // {
        //     text: 'Это данные из инилизационного стейта, ответа нет',
        //     index: 0,
        //     logprobs: null,
        //     finish_reason: 'stop'
        // }
    ],
    usage: {
        prompt_tokens: 36,
        completion_tokens: 532,
        total_tokens: 568
    }
}

export const GPTReducer = (state: GPTResponseType = initialState, action: ActionsType): GPTResponseType => {
    switch (action.type) {
        case 'GET-GPT-Response':
            return {
                ...state,
                choices: [
                    {...state.choices[0], text: action.data.choices[0].text},
                ]

            }
        default:
            return state
    }
}

// actions

export const gptAC = (data: GPTResponseType) => ({
    type: 'GET-GPT-Response',
    data
} as const)


// thunks

export const gptTC = (requestText:string) => {
    return (dispatch: ThunkDispatch) => {
        openai.createCompletion({
                model: 'text-davinci-003',
                prompt: requestText ,
                temperature: 0.5,
                max_tokens: 4000,
            }
        ).then(res => {
            console.log(res.data.choices[0].text)
            dispatch(gptAC(res.data))
        })
            .catch((e => {
                console.log(e)
            }))
    }
}

export type GPTACActionType = ReturnType<typeof gptAC>;
type ActionsType = GPTACActionType
// | CatFactACActionType

type ThunkDispatch = Dispatch<ActionsType>


type GPTResponseType = {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<CreateCompletionResponseChoicesInner>;
    usage?: CreateCompletionResponseUsage;
}

// type GPTResponseType = {
//     warning: string
//     id: string
//     object: string
//     created: number
//     model: string
//     choices: GPTResponseChoiceType[]
//     usage: GPTResponseUsageType
// }

type GPTResponseChoiceType = {
    text: string
    index: number
    logprobs: null | any
    finish_reason: string
}

type GPTResponseUsageType = {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
}


// const ans = {
//     'warning': 'This model version is deprecated. Migrate before January 4, 2024 to avoid disruption of service. Learn more https://platform.openai.com/docs/deprecations',
//     'id': 'cmpl-7j8nKuhart1Qe3aML7ye71TZjKNRN',
//     'object': 'text_completion',
//     'created': 1690992922,
//     'model': 'text-davinci-003',
//     'choices': [
//         {
//             'text': '\n\nРоссия – это крупнейшая в мире федерация, расположенная в Восточной Европе и Северной Азии. Она граничит с девятью странами и окружена пятью морями. Россия является многонациональной державой, в которой проживает более 150 национальностей. Она известна своими величественными памятниками истории и культуры, а также многочисленными природными объектами, такими как Кавказские горы, Уральская плоскость и лесные массивы Сибири. Россия также известна своими богатыми традициями культуры, искусства и кухни.',
//             'index': 0,
//             'logprobs': null,
//             'finish_reason': 'stop'
//         }
//     ],
//     'usage': {
//         'prompt_tokens': 36,
//         'completion_tokens': 532,
//         'total_tokens': 568
//     }
// }
