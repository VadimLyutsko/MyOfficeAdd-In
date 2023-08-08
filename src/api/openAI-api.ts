// import axios from 'axios';
//
//
// const instance = axios.create({
//     baseURL: 'https://catfact.ninja/fact',
//
// })
//
// // api
// export const exampleCatAPI = {
//
//     getCatData(){
//         return instance.get('');
//     },
// }

import {Configuration, OpenAIApi} from 'openai';

const configuration = new Configuration({
    apiKey: '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',
})
export const openai = new OpenAIApi(configuration);
