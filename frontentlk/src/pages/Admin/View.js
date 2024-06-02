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
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Image,
    Container,
    RadioGroup,
    HStack,
    Radio,
    Textarea,
    Button,
    ButtonGroup,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useToast,
    useDisclosure,
    Spinner,
    Center
} from '@chakra-ui/react'
import not_found from '../../assets/not_found.svg'
import {useParams, Navigate} from 'react-router-dom'
import { useForm } from "react-hook-form";

const Track = lazy(() => import('../../sections/Track'))

export default function View() {
    let params = useParams();

    const [release, setRelease] = useState();
    const [tracks, setTracks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [method, setMethod] = useState(null);
    const [isAll, setIsAll] = useState(false);

    const { register, handleSubmit } = useForm();

    const toast = useToast()

    const getRelease = async () => {
        const data = await axios.get(`${apiUrl()}/admin/get_release_info?id=${params.id}`, {
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

    const reject_release = async (reason) => {
        setIsLoading(true)
        try {
            const {data} = await axios.post(`${apiUrl()}/admin/reject_release`, {id: params.id, reason: reason}, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            if(data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setIsAll(true)
                toast({
                    title: `Релиз отклонен!`,
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
        setIsLoading(false)
    }

    const accept_release = async (upc) => {
        setIsLoading(true)
        try {
            const {data} = await axios.post(`${apiUrl()}/admin/accept_release`, {id: params.id, upc: upc}, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            if(data.error) {
                toast({
                    title: `Произошла ошибка!`,
                    description: data.error,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                setIsAll(true)
                toast({
                    title: `Релиз принят!`,
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
        setIsLoading(false)
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const onSubmit = (data) => {
        if(method === 'accept') {
            accept_release(data.upc)
        }
        if(method === 'reject') {
            reject_release(data.reason)
        }
        onClose()
    }

    return (
        <Box m='40px'>
            {notFound && (
                <Navigate to='/404' />
            )}
            {isAll && (
                <Navigate to='/admin/moderation' />
            )}
            <Heading>Информация о релизе</Heading>
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
                    </Box>
                </Box>
                <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Основная информация</Heading>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='title'>Название релиза</FormLabel>
                                <Input id='title' defaultValue={release.title} placeholder='Название релиза' type='text' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='version'>Версия</FormLabel>
                                <Input id='version' defaultValue={release.version}  type='text' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>Артисты</FormLabel>
                                <Input id='artists' defaultValue={release.artists}   type='text' isReadOnly />
                            </FormControl>
                            <FormControl as='type'>
                                <FormLabel as='type'>Тип релиза</FormLabel>
                                <RadioGroup defaultValue={release.type} >
                                    <HStack spacing='24px'>
                                        <Radio value='Single' isReadOnly>Single</Radio>
                                        <Radio value='EP' isReadOnly>EP</Radio>
                                        <Radio value='Album' isReadOnly>Album</Radio>
                                    </HStack>
                                </RadioGroup>
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='genre'>Жанр</FormLabel>
                                <Input id='genre' defaultValue={release.genre}   type='text' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='date'>Дата релиза</FormLabel>
                                <Input id='date' defaultValue={release.date} placeholder='Выберите дату релиза' type='date' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='comment'>Комментарий модератору</FormLabel>
                                <Textarea id='comment' defaultValue={release.comment} placeholder='Комментарий модератору' type='text' isReadOnly />
                            </FormControl>
                            {release.status === 'moderation' && (
                                <ButtonGroup w='100%' mt='10px'>
                                    <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} onClick={() => {setMethod('accept'); onOpen()}} isLoading={isLoading}>
                                        Принять
                                    </Button>
                                    <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} onClick={() => {setMethod('reject'); onOpen()}} isLoading={isLoading}>
                                        Отклонить
                                    </Button>
                                </ButtonGroup>
                            )}
                    </Box>
                </Box>
            </SimpleGrid>
            <Box mt='10px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Треки</Heading>
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
                    <ModalHeader>{method === 'reject' && 'Отклонить релиз' || 'Принять релиз'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {method === 'reject' && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <FormLabel htmlFor='reason'>Причина</FormLabel>
                                    <Input id='reason' placeholder='Причина' isRequired type='text' {...register('reason')} />
                                </FormControl>
                                <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                                    Отклонить
                                </Button>
                            </form>
                        )}
                        {method === 'accept' && (
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FormControl>
                                    <FormLabel htmlFor='upc'>UPC</FormLabel>
                                    <Input id='upc' placeholder='UPC' type='text' isRequired {...register('upc')} />
                                </FormControl>
                                <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                                    Принять
                                </Button>
                            </form>
                        )}
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </Box>
            )}
        </Box>
    )
}