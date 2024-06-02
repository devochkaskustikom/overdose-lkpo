import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import {Center, Spinner} from '@chakra-ui/react'

export default function NewRelease() {
    const [release_id, setRelease_id] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const newR = async () => {
            const data = await axios.post(`${apiUrl()}/user/new_release`, null, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            setRelease_id(data.data.release.id)

            setLoaded(true)

        }
        if(!loaded) {    
            newR()
        }
    }, [])

    return (
        <div>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            )}
            {loaded && (
                <Navigate to={`/edit/${release_id}`} />
            )}
        </div>
    )
}