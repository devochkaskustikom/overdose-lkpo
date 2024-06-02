import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import {Center, Spinner} from '@chakra-ui/react'

export default function NewRelease() {
    const [link_id, setLink_id] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const newL = async () => {
            const data = await axios.post(`${apiUrl()}/user/new_link`, null, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            setLink_id(data.data.link.id)

            setLoaded(true)

        }
        if(!loaded) {    
            newL()
        }
    }, [])

    return (
        <div>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            )}
            {loaded && (
                <Navigate to={`/link/edit/${link_id}`} />
            )}
        </div>
    )
}