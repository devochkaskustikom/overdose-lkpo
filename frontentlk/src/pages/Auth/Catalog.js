import {
    Box,
    Link,
    Heading,
    Container,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Image,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
    useToast,
    Spinner,
    Center
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import React from 'react';
import not_found from '../../assets/not_found.svg'
import {Link as RLink} from 'react-router-dom';

export default function Catalog() {
    const [releases, setReleases] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const getReleases = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_releases`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        setReleases(data.data.releases)
        setLoaded(true)
    }

    useEffect(() => {
        if(!loaded) {    
            getReleases()
        }
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const [delete_id, setDeleteID] = useState(0);
    const [delete_name, setDeleteName] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const delete_draftModal = (id, name) => {
        setDeleteID(id)
        setDeleteName(name)
        onOpen()
    }

    const toast = useToast()

    const delete_draft = async () => {
        setIsLoading(true)
        try {
            const data = await axios.post(`${apiUrl()}/user/delete_draft`, {id: delete_id}, {
                headers: {
                  'authorization': `Bearer ${getToken()}`
                }
            })

            if(data.data.error) {
                toast({
                    title: 'Произошла ошибка!',
                    description: data.data.error,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            } else {
                toast({
                    title: 'Черновик удален',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch(e) {
            toast({
                title: 'Произошла ошибка!',
                description: e,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        getReleases()
        setIsLoading(false)
        onClose()
    }

    return (
        <Box alignItems='center' textAlign='center'>
            <Heading fontWeight='bold' size='2xl'>Каталог</Heading>
            <Container maxW='container.xl' alignContent='center' alignItems='center'>
            <TableContainer mt='20px'>
                <Table>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Тип</Th>
                            <Th>Название</Th>
                            <Th>Версия</Th>
                            <Th>Артист</Th>
                            <Th>UPC</Th>
                            <Th>Статус</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {releases.map((release) => {
                            return (
                                <Tr>
                                    <Th>
                                        <Image borderWidth='1px' borderRadius='lg' src={`https://img.gs/lprfwxwbrz/100x100/${apiUrl()}${release.cover}`} fallbackSrc={not_found} w='50px' h='50px' />
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/view/${release.id}`}>{release.type || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/view/${release.id}`}>{release.title || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/view/${release.id}`}>{release.version || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/view/${release.id}`}>{release.artists || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        {release.upc || 'Н/А'}
                                    </Th>
                                    <Th>
                                    {release.status === 'ok' && (
                                            <Box>На площадках</Box>
                                    ) || release.status === 'moderation' && (
                                        <Box>На модерации</Box>
                                    ) || release.status === 'draft' && (
                                        <Box>Черновик</Box>
                                    )}
                                    </Th>
                                    <Th>
                                        {release.status === 'draft' && (
                                            <Box>
                                                <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/edit/${release.id}`}><i className="bi bi-pencil"></i> Редактировать</Link>, <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {delete_draftModal(release.id, release.title)}}><i className="bi bi-trash"></i> Удалить</Link>
                                            </Box>
                                        )}
                                    </Th>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            {!loaded && (
                <Center mt='20px'><Spinner color='red' size='xl' /></Center>
            )}
            </Container>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Удалить черновик
                    </AlertDialogHeader>

                    <AlertDialogBody>
                    Вы уверены, что хотите удалить черновик "{delete_name || 'Н/А'}" навсегда? Вы не сможете отменить это действие
                    </AlertDialogBody>

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Отменить
                    </Button>
                    <Button colorScheme='red' onClick={delete_draft} isLoading={isLoading} ml={3}>
                        Удалить
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}