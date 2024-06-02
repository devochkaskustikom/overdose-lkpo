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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    Input,
    FormControl,
    FormLabel,
    Select,
    Spinner,
    Center
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import { useForm } from "react-hook-form";

function Users() {
    const [users, setUsers] = useState([])
    const [edit_id, setEditID] = useState(0);
    const [edit_name, setEditName] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const get_users = async () => {
        const data = await axios.get(`${apiUrl()}/admin/get_users`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        setUsers(data.data.users)
        setLoaded(true)
    }

    useEffect(() => {
        if(!loaded) {
            get_users()
        }
    }, [])

    const toast = useToast()
    const { register, handleSubmit } = useForm();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const edit_user = async (raw) => {
        setIsLoading(true)
        try {
            let data = raw
            if(data.password === '') delete data.password;
            if(data.username === '') delete data.username;
            if(data.email === '') delete data.email;
            if(data.name === '') delete data.name;
            if(data.balance === '') delete data.balance;
            if(data.status === '') delete data.status;

            Object.assign(data, {id: edit_id});

            const {data: response} = await axios.post(`${apiUrl()}/admin/edit_user`, data, {
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
                    title: `Пользователь сохранен!`,
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
        onClose()
        get_users()
        setIsLoading(false)
    }

    return (
        <Box alignItems='center' textAlign='center'>
            <Heading fontWeight='bold' size='2xl'>Пользователи</Heading>
            <Container maxW='container.xl' alignContent='center' alignItems='center'>
            <TableContainer mt='20px'>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>#</Th>
                            <Th>Имя</Th>
                            <Th>Логин</Th>
                            <Th>Email</Th>
                            <Th>Баланс</Th>
                            <Th>Статус</Th>
                            <Th></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => {
                            return (
                                <Tr>
                                    <Th>{user.id}</Th>
                                    <Th>{user.name}</Th>
                                    <Th>{user.username}</Th>
                                    <Th>{user.email}</Th>
                                    <Th>{user.balance}</Th>
                                    <Th>{user.status}</Th>
                                    <Th><Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {
                                        setEditID(user.id)
                                        setEditName(user.name)
                                        onOpen()
                                    }}><i className="bi bi-pencil"></i> Редактировать</Link></Th>
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
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Редактирование пользователя {edit_name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(edit_user)}>
                        <FormControl>
                            <FormLabel htmlFor='username'>Новый логин</FormLabel>
                            <Input id='username' placeholder='Логин' type='text' {...register('username')} />
                        </FormControl>
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='email'>Новый Email</FormLabel>
                            <Input id='email' placeholder='Email' type='email' {...register('email')} />
                        </FormControl>
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='name'>Новое имя</FormLabel>
                            <Input id='name' placeholder='Имя' type='text' {...register('name')} />
                        </FormControl>
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='balance'>Новый баланс</FormLabel>
                            <Input id='balance' placeholder='Баланс' type='text' {...register('balance')} />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='status'>Новый статус</FormLabel>
                                <Select id='status' placeholder='Выберите статус' {...register('status')}>
                                    <option value='Пользователь'>Пользователь</option>
                                    <option value='admin'>Админ</option>
                                </Select>
                            </FormControl>
                        <FormControl mt='10px'>
                            <FormLabel htmlFor='password'>Новый пароль</FormLabel>
                            <Input id='password' placeholder='Пароль' type='text' {...register('password')} />
                        </FormControl>
                        
                        <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                            Сохранить
                        </Button>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Users;