import { defineStore } from "pinia";
import { login } from '../api/login';

// pina
export const useLoginStore = defineStore('logins', () => {

    // login().then((res) => {
    //     localStorage.setItem('token', res.data?.data?.token);
    // }).catch(err => {

    // })
    return {
    }
})