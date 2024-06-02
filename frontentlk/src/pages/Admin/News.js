import {
    Box,
    Heading,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useToast,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Spinner,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import { useForm } from "react-hook-form";
import NewsBlock from '../../sections/NewsBlock'

export default function Main() {
    const [news, setNews] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast()
    const { register, handleSubmit } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure()

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
    useEffect(() => {
        const loading = async () => {
            getNews()
        }
        if(!loaded) {    
            loading()
        }
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const {data: response} = await axios.post(`${apiUrl()}/admin/new_news`, data, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            if(response.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: response.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Новость создана!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch(e) {
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        getNews()
        onClose()
        setIsLoading(false)
    }

    return (
        <Box>
            <Box m='40px'>
                <Heading>Новости</Heading>
                <Button mt='10px' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} onClick={onOpen} isLoading={isLoading}>
                    Создать новость
                </Button>
                {loaded && (
                    <Box>
                        {!news && (
                            <Heading mt='10px' size='lg'>Новостей не найдено</Heading>
                        )}
                    </Box>
                )}
                {!loaded && (
                    <Box>
                        <Spinner color='red' size='xl' />
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Создать новость</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl>
                            <FormLabel htmlFor='title'>Заголовок</FormLabel>
                            <Input id='title' placeholder='Заголовок' type='text' isRequired {...register('title')} />
                        </FormControl>
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='body'>Текст </FormLabel>
                            <Textarea id='body' placeholder='Можно использовать HTML' type='text' isRequired {...register('body')} />
                        </FormControl>
                        <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                            Создать
                        </Button>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}