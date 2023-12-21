import axios from "axios";
import { LOGIN_USER, REGISTER_USER, AUTH_USER } from './types'

export function loginUser(dataToSubmit) {
    const requeset = axios.post('/api/users/login', dataToSubmit)
        .then(res => res.data)

    // Reducer로 보낸다
    return {
        type: LOGIN_USER,
        payload: requeset
    }
}

export function registerUser(dataToSubmit) {

    const requeset = axios.post('/api/users/register', dataToSubmit)
        .then(res => res.data)

    // Reducer로 보낸다
    return {
        type: REGISTER_USER,
        payload: requeset
    }
}

export function auth() {

    const requeset = axios.post('/api/users/auth')
        .then(res => res.data)

    // Reducer로 보낸다
    return {
        type: AUTH_USER,
        payload: requeset
    }
}