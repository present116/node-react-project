import axios from "axios";
import { LOGIN_USER } from './types'

export function loginUser(dataToSubmit) {
    console.log('dataToSubmit', dataToSubmit)

    const requeset = axios.post('/api/users/login', dataToSubmit)
        .then(res => res.data)
    console.log('request', requeset)

    // Reducer로 보낸다
    return {
        type: LOGIN_USER,
        payload: requeset
    }
}