import { useState, useEffect, lazy, Suspense } from 'react';
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
    Link
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import not_found from '../../assets/not_found.svg'
import {useParams, Navigate} from 'react-router-dom'
import FilePicker from 'chakra-ui-file-picker'
import { ExternalLinkIcon } from '@chakra-ui/icons'

const Track = lazy(() => import('../../sections/Track'))

export default function Edit() {
    let params = useParams();

    const [release, setRelease] = useState();
    const [tracks, setTracks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isModeration, setIsModeration] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const toast = useToast()

    const getRelease = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_release_info?id=${params.id}`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })
        if(data.data.error) {
            setNotFound(true)
        } else {
            setRelease(data.data.release)
            setTracks(data.data.tracks)
            setLoaded(true)
        }
    }

    useEffect(() => {
        if(!loaded) {    
            getRelease()
        }
    }, [])
    const { register, handleSubmit } = useForm();

    const uploadCover = async (files) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("cover", files[0])
            formData.append("id", params.id)
            const data = await axios.post(`${apiUrl()}/user/edit_release`, formData, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })
            if(data.data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: data.data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Обложка загружена!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (e) {
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        getRelease()
        setIsLoading(false)
    }

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl()}/user/edit_release`, data, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })
            if(response.data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: response.data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Релиз сохранен`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (e) {
            toast({
                title: `Произошла ошибка!`,
                description: e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        getRelease()
        setIsLoading(false)
    }

    const send_release = async () => {
        setIsLoading(true)
        try {
            const form = document.getElementById("main")

            const FD = new FormData(form)

            await axios.post(`${apiUrl()}/user/edit_release`, FD, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })

            getRelease()

            const response = await axios.post(`${apiUrl()}/user/send_release`, {id: params.id}, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })

            if(response.data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: response.data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setIsModeration(true)
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
        setIsLoading(false)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const newTrack = async () => {
        setIsLoading(true)
        try {
            let form = document.getElementById("main")

            let FD = new FormData(form)

            await axios.post(`${apiUrl()}/user/edit_release`, FD, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })
            form = document.getElementById("new_track")

            FD = new FormData(form)

            const response = await axios.post(`${apiUrl()}/user/new_track`, FD, {
                headers: {
                'authorization': `Bearer ${getToken()}`
                }
            })

            if(response.data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: `${response.data.error.message}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: `Трек создан!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onClose()
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
        
        getRelease()
        setIsLoading(false)
    }

    return (
        <Box m='40px'>
            {notFound && (
                <Navigate to='/404' />
            )}
            {isModeration && (
                <Navigate to='/catalog' />
            )}
            <Heading>Редактирование релиза</Heading>
            <Link color='gray' mt='10px' _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} href='/terms/requirements' isExternal>Требования к релизу <ExternalLinkIcon mx='2px' /></Link>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            )}
            {loaded && (
                <Box>
                <SimpleGrid mt='10px' columns={[1, 2]} spacing='10px'>
                <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Обложка</Heading>
                        <Image mt='10px' mb='10px' src={`${apiUrl()}${release.cover}`} fallbackSrc={not_found} w='300px' h='300px' borderWidth='2px' borderRadius='lg' />
                        <FilePicker
                            onFileChange={(fileList) => { uploadCover(fileList) }}
                            placeholder="Загрузите обложку"
                            clearButtonLabel="label"
                            multipleFiles={false}
                            accept="image/*"
                            hideClearButton={true}
                        />
                        <Text mt='20px'><b>Требования к обложке:</b><br /><br/>Разрешение: 3000x3000<br/>Формат: jpg или png</Text>
                    </Box>
                </Box>
                <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Основная информация</Heading>
                        <Text fontSize='sm'>* - обязательное поле</Text>
                        <form onSubmit={handleSubmit(onSubmit)} id='main'>
                            <Input hidden='hidden' value={params.id} {...register('id')} />
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='title'>* Название релиза</FormLabel>
                                <Input id='title' defaultValue={release.title} placeholder='Название релиза' type='text' {...register('title')} />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='version'>Версия</FormLabel>
                                <Input id='version' defaultValue={release.version}  type='text' {...register('version')} />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>* Артисты</FormLabel>
                                <Input id='artists' defaultValue={release.artists}  placeholder='Перечислите артистов через запятую' type='text' {...register('artists')} />
                            </FormControl>
                            <FormControl as='type'>
                                <FormLabel as='type'>* Тип релиза</FormLabel>
                                <RadioGroup defaultValue={release.type} >
                                    <HStack spacing='24px'>
                                        <Radio value='Single' {...register('type')}>Single</Radio>
                                        <Radio value='EP' {...register('type')}>EP</Radio>
                                        <Radio value='Album' {...register('type')}>Album</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='genre'>* Жанр</FormLabel>
                                <Select id='genre' placeholder='Выберите жанр' defaultValue={release.genre} {...register('genre')}>
                                    <option value="African">African</option>
                                    <option value="Alternative">Alternative</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Asian">Asian</option>
                                    <option value="Blues">Blues</option>
                                    <option value="Brazilian">Brazilian</option>
                                    <option value="Children Music">Children Music</option>
                                    <option value="Christian & Gospel">Christian & Gospel</option>
                                    <option value="Classical">Classical</option>
                                    <option value="Country">Country</option>
                                    <option value="Dance">Dance</option>
                                    <option value="Easy Listening">Easy Listening</option>
                                    <option value="Electronic">Electronic</option>
                                    <option value="Folk">Folk</option>
                                    <option value="Hip Hop/Rap">Hip Hop/Rap</option>
                                    <option value="Indian">Indian</option>
                                    <option value="Jazz">Jazz</option>
                                    <option value="Latin">Latin</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Pop">Pop</option>
                                    <option value="R&B/Soul">R&B/Soul</option>
                                    <option value="Reggae">Reggae</option>
                                    <option value="Relaxation">Relaxation</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Various">Various</option>
                                    <option value="World Music / Regional Folklore">World Music / Regional Folklore</option>
                                </Select>
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='date'>* Дата релиза</FormLabel>
                                <Input id='date' defaultValue={release.date} placeholder='Выберите дату релиза' type='date' {...register('date')} />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='comment'>Комментарий модератору</FormLabel>
                                <Textarea id='comment' defaultValue={release.comment} placeholder='Комментарий модератору' type='text' {...register('comment')} />
                            </FormControl>
                            <ButtonGroup w='100%' mt='10px'>
                                <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                                    Сохранить
                                </Button>
                                <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} onClick={() => {send_release()}} isLoading={isLoading}>
                                    Отправить
                                </Button>
                            </ButtonGroup>
                        </form>
                    </Box>
                </Box>
            </SimpleGrid>
            <Box mt='10px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Треки</Heading>
                        <Button mt='10px' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }}  isLoading={isLoading} onClick={onOpen}>
                            Добавить трек
                        </Button>
                        <Container maxW='container.xl' alignContent='center' alignItems='center'>
                            <TableContainer mt='20px'>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th></Th>
                                            <Th>Название</Th>
                                            <Th>Версия</Th>
                                            <Th>Артист</Th>
                                            <Th>Автор</Th>
                                            <Th>Композитор</Th>
                                            <Th>Explicit</Th>
                                            <Th></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tracks.map((track) => {
                                            return (
                                                <Suspense fallback={<Center mt='20px'><Spinner color='red' size='xl' /></Center>}><Track track={track} /></Suspense>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Container>
                    </Box>
                </Box>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Новый трек</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading>Новый трек</Heading>
                        <Text fontSize='sm'>* - обязательное поле</Text>
                        <form mt='10px' enctype="multipart/form-data" id='new_track'>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='wav'>* Wav файл</FormLabel>
                                <input type='file' accept='audio/wav' name='wav' placeholder='Загрузите трек'></input>
                            </FormControl>
                            
                            <input type='text' name='id' hidden='hidden' value={release.id}></input>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='title'>* Название трека</FormLabel>
                                <Input id='title' placeholder='Название трека' name='title' type='text' required='required' />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='version'>Версия</FormLabel>
                                <Input id='version' type='text' name='version' />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>* Артисты</FormLabel>
                                <Input id='artists' required='required' placeholder='Перечислите артистов через запятую' type='text' name='artists' />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>* Авторы(ФИО)</FormLabel>
                                <Input id='artists' placeholder='Перечислите авторов через запятую' type='text' name='author' required='required' />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>* Композитор(ФИО)</FormLabel>
                                <Input id='artists' placeholder='Перечислите композиторов через запятую' type='text' name='composer' required='required' />
                            </FormControl>
                            <FormControl as='type'>
                                <FormLabel as='type'>* Присутствие ненармотивной лексики</FormLabel>
                                <RadioGroup >
                                    <HStack spacing='24px'>
                                        <Radio value='0' name='explicit'>Нет</Radio>
                                        <Radio value='1' name='explicit'>Да</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                            <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }}  isLoading={isLoading} onClick={newTrack}>
                                Добавить трек
                            </Button>
                        </form>
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
            )}
        </Box>
    )
}