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
    Link,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import not_found from '../../assets/not_found.svg'
import {useParams, Navigate} from 'react-router-dom'
import FilePicker from 'chakra-ui-file-picker'
import Track from '../../sections/Track'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {lazy, Suspense} from 'react'

const Cover = lazy(() => import('../../sections/EditLink/Cover'))
const Settings = lazy(() => import('../../sections/EditLink/Settings'))
const Analytics = lazy(() => import('../../sections/EditLink/Analytics'))

export default function Edit() {
    let params = useParams();

    const Loader = () => (
        <Center><Spinner color='red' size='xl' /></Center>
    )

    const [link, setLink] = useState();
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSave, setIsSave] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const toast = useToast()

    const getlink = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_link_by_id?id=${params.id}`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })
        if(data.data.error) {
            setNotFound(true)
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
                setIsSave(true)
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
        getlink()
        setIsLoading(false)
    }

    
    return (
        <Box m='40px'>
            {notFound && (
                <Navigate to='/404' />
            )}
            {isSave && (
                <Navigate to='/links' />
            )}
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            )}
            {loaded && (
                <Container>
                    <Heading mb='10px'>{link.title}</Heading>
                    <Tabs variant='soft-rounded' colorScheme='red' isLazy>
                        <TabList>
                            <Tab>Обложка</Tab>
                            <Tab>Настройки</Tab>
                            <Tab>Аналитика</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Suspense fallback={<Loader />}><Cover id={params.id}/></Suspense>
                            </TabPanel>
                            <TabPanel>
                            <Suspense fallback={<Loader />}><Settings id={params.id}/></Suspense>
                            </TabPanel>
                            <TabPanel>
                            <Suspense fallback={<Loader />}><Analytics id={params.id}/></Suspense>
                            </TabPanel>
                        </TabPanels>
                        </Tabs>
                </Container>
            )}
        </Box>
    )
}