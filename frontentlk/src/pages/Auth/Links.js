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
    Center,
    Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import React from 'react';
import not_found from '../../assets/not_found.svg'
import {Link as RLink} from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons'

export default function Links() {
    const [links, setLinks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [delete_link, setDeleteLink] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast()

    const getLinks = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_links`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        setLinks(data.data.links)
        setLoaded(true)
    }

    useEffect(() => {
        if(!loaded) {    
            getLinks()
        }
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()

    const delete_linkModal = (link) => {
        setDeleteLink(link)
        onOpen()
    }

    const deleteLink = async () => {
        setIsLoading(true)
        try {
            const data = await axios.post(`${apiUrl()}/user/delete_link`, {id: delete_link.id}, {
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
                    title: 'Ссылка удалена',
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
        getLinks()
        setIsLoading(false)
        onClose()
    }

    return (
        <Box alignItems='center' textAlign='center'>
            <Heading fontWeight='bold' size='2xl'>Промо ссылки</Heading>
            <Button size='sm' mt='10px' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} as={RLink} to='/link/new'>Создать ссылку</Button>
            <Container maxW='container.xl' alignContent='center' alignItems='center'>
            <TableContainer mt='20px'>
                <Table>
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th>Название</Th>
                            <Th>Артист</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {links.map((link) => {
                            return (
                                <Tr>
                                    <Th>
                                        <Image borderWidth='1px' borderRadius='lg' src={`https://img.gs/lprfwxwbrz/100x100/${apiUrl()}${link.cover}`} fallbackSrc={not_found} w='50px' h='50px' />
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/l/${link.token}`}>{link.title || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/l/${link.token}`}>{link.artists || 'Н/А'}</Link>
                                    </Th>
                                    <Th>
                                        <Link _hover={{ color: 'red', textDecoration: 'none' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={Link} href={`/l/${link.token}`} isExternal><ExternalLinkIcon mx='2px' /> Перейти</Link>, <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to={`/link/edit/${link.id}`}><i className="bi bi-pencil"></i> Редактировать</Link>, <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {delete_linkModal(link)}}><i className="bi bi-trash"></i> Удалить</Link>
                                    </Th>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    Удалить ссылку
                    </AlertDialogHeader>

                    {delete_link && (
                        <AlertDialogBody>
                            Вы уверены, что хотите удалить ссылку на релиз "{delete_link.artists || 'Н/А'} - {delete_link.title || 'Н/А'}" навсегда? Вы не сможете отменить это действие
                        </AlertDialogBody>
                    )}

                    <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        Отменить
                    </Button>
                    <Button colorScheme='red' onClick={deleteLink} isLoading={isLoading} ml={3}>
                        Удалить
                    </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            {!loaded && (
                <Center mt='20px'><Spinner color='red' size='xl' /></Center>
            )}
            </Container>
        </Box>
    )
}