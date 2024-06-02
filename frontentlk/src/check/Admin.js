import Auth from './Auth'
import apiUrl from '../config/apiUrl'
import getToken from '../config/getToken'
import axios from 'axios'
import { useState, useEffect } from 'react';

export default function Admin() {
    const [admin, setAdmin] = useState(null)
    const check = async () => {
        const auth = Auth()
        if(auth) {
            const { data: user } = await axios.get(`${apiUrl()}/user/profile_info`, {
                headers: {
                    'authorization': `Bearer ${getToken()}`
                }
            });
            if(user.user.status === 'admin') {
                setAdmin(true)
            } else {
                setAdmin(false)
            }
        } else {
            setAdmin(false)
        }
    }
    useEffect(() => {
        if(admin === null) {
            check()
        }
    }, [])
    return admin
}