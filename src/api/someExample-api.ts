import axios from 'axios';


const instance = axios.create({
    baseURL: 'https://catfact.ninja/fact',

})

// api
export const exampleCatAPI = {

    getCatData(){
        return instance.get('');
    },
}
