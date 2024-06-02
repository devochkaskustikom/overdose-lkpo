import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import {
    SimpleGrid,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    useToast,
    Image,
    Text,
    Container,
    RadioGroup,
    HStack,
    Radio,
    Select,
    Textarea,
    ButtonGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Spinner,
    Center,
    InputGroup,
    InputLeftAddon,
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import not_found from '../../assets/not_found.svg'
import {useParams, Navigate} from 'react-router-dom'
import FilePicker from 'chakra-ui-file-picker'
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Cover(props) {
    const [link, setLink] = useState();
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast()
    const getlink = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_link_by_id?id=${props.id}`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })
        if(data.data.error) {
            toast({
                title: `Произошла ошибка!`,
                description: `${data.data.error}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } else {
            setLink(data.data.link)
            setLoaded(true)
        }
    }

    useEffect(() => {
        if(!loaded) {    
            getlink()
        }
    }, [])
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl()}/user/edit_link`, data, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })
            if(response.data.error) {
                toast({
                    title: `Айди занят!`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Ссылка сохранена`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (e) {
            toast({
                title: `Произошла ошибка!`,
                description: `${e}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        getlink()
        setIsLoading(false)
    }

    return (
        <Box>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            ) || (
                <Box>
                    <Heading>Настройки</Heading>
                    <Text fontSize='sm'>* - обязательное поле</Text>
                    <form onSubmit={handleSubmit(onSubmit)} id='main'>
                        <Input hidden='hidden' value={props.id} {...register('id')} />
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='title'>* Название релиза</FormLabel>
                            <Input id='title' defaultValue={link.title} placeholder='Название релиза' type='text' {...register('title')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>* Артисты</FormLabel>
                            <Input  defaultValue={link.artists}  placeholder='Перечислите артистов через запятую' type='text' {...register('artist')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>* Адрес ссылки</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children='https://overdose.media/l/' />
                                <Input  defaultValue={link.token}  placeholder='Введите адрес ссылки' type='text' isRequired {...register('token')} />
                            </InputGroup>
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на Apple Music</FormLabel>
                            <Input  defaultValue={link.apple}  placeholder='Укажите ссылку на Apple Music' type='url' {...register('apple')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на Spotify</FormLabel>
                            <Input  defaultValue={link.spotify}  placeholder='Укажите ссылку на Spotify' type='url' {...register('spotify')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на VK Music</FormLabel>
                            <Input  defaultValue={link.vk}  placeholder='Укажите ссылку на VK Music' type='url' {...register('vk')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на YouTube Music</FormLabel>
                            <Input defaultValue={link.yt_music}  placeholder='Укажите ссылку на YouTube Music' type='url' {...register('yt')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на Яндекс Музыку</FormLabel>
                            <Input defaultValue={link.yandex}  placeholder='Укажите ссылку на Яндекс Музыку' type='url' {...register('yandex')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на SoundCloud</FormLabel>
                            <Input defaultValue={link.soundcloud}  placeholder='Укажите ссылку на SoundCloud' type='url' {...register('soundcloud')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на iTunes</FormLabel>
                            <Input defaultValue={link.itunes}  placeholder='Укажите ссылку на iTunes' type='url' {...register('itunes')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на Tidal</FormLabel>
                            <Input defaultValue={link.tidal}  placeholder='Укажите ссылку на Tidal' type='url' {...register('tidal')} />
                        </FormControl>
                        <FormControl mt='10px' mb='10px'>
                            <FormLabel htmlFor='artists'>Ссылка на Deezer</FormLabel>
                            <Input defaultValue={link.deezer}  placeholder='Укажите ссылку на Deezer' type='url' {...register('deezer')} />
                        </FormControl>
                        <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                                Сохранить
                        </Button>
                    </form>
                </Box>
            )}
        </Box>
    )
}