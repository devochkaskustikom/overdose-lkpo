import {
    Box,
    Link,
    Heading,
    Text,
    Spinner
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import {Link as RLink} from 'react-router-dom';
import NewsBlock from '../../sections/NewsBlock'

export default function Main() {
    const [news, setNews] = useState(null);
    const [balance, setBalance] = useState(0);
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
            const data = await axios.get(`${apiUrl()}/user/profile_info`, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })
  
            setBalance(data.data.user.balance)

            getNews()
        }
        if(!loaded) {    
            loading()
        }
    }, []);
    return (
        <Box>
            <Box m='40px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                <Box m='40px'>
                    <Heading>👋 Привет!</Heading>
                    {!loaded && (
                        <Spinner color='red' size='xl' />
                    ) || (
                        <Box>
                            <Text mt='10px' fontSize='xl'>Ваш баланс: {balance}₽</Text>
                            <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/finance'>Перейти в Финансы</Link>
                        </Box>
                    )}
                </Box>
            </Box>
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
                        <NewsBlock title={news[0].title} body={news[0].body} date={news[0].created_at} />
                        <Link mt='40px' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/news'>Показать все</Link>
                    </Box>
                )}
            </Box>
        </Box>
    )
}