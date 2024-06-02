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
    const uploadCover = async (files) => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("cover", files[0])
            formData.append("id", props.id)
            const data = await axios.post(`${apiUrl()}/user/edit_link`, formData, {
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
        getlink()
        setIsLoading(false)
    }
    return (
        <Box>
            {!loaded && (
                <Center><Spinner color='red' size='xl' /></Center>
            ) || (
                <Box>
                    <Heading>Обложка</Heading>
                    <Image mt='10px' mb='10px' src={`${apiUrl()}${link.cover}`} fallbackSrc={not_found} w='300px' h='300px' borderWidth='2px' borderRadius='lg' />
                    <FilePicker
                        onFileChange={(fileList) => { uploadCover(fileList) }}
                        placeholder="Загрузите обложку"
                        clearButtonLabel="label"
                        multipleFiles={false}
                        accept="image/*"
                        hideClearButton={true}
                    />
                    <Text mt='20px'><b>Требования к обложке:</b><br /><br/>Разрешение: минимум 1000x1000<br/>Формат: jpg или png</Text>
                </Box>
            )}
        </Box>
    )
}