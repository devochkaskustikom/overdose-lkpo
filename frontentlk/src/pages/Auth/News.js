import {
    Box,
    Heading,
    Spinner
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import NewsBlock from '../../sections/NewsBlock'

export default function Main() {
    const [news, setNews] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const getNews = async () => {
            const data = await axios.get(`${apiUrl()}/user/get_news`, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            if(data.data.news.length === 0) {
                setNews(null)
                setLoaded(true);
            } else {
                setNews(data.data.news)
                setLoaded(true);
            }
        }
        const loading = async () => {
            getNews()
        }
        if(!loaded) {    
            loading()
        }
    }, []);
    return (
        <Box>
            <Box m='40px'>
                <Heading>Новости</Heading>
                {!loaded && (
                    <Spinner color='red' size='xl' />
                )}
                {loaded && (
                    <Box>
                        {!news && (
                            <Heading mt='10px' size='lg'>Новостей не найдено</Heading>
                        )}
                    </Box>
                )}
                {news && (
                    <Box>
                        {news.map((item) => {
                            return (
                                <NewsBlock title={item.title} body={item.body} date={item.created_at} />
                            )
                        })}
                    </Box>
                )}
            </Box>
        </Box>
    )
}