import {
    Box,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Container,
    Heading,
    Text,
    Button,
    Link,
    useToast
} from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import apiUrl from '../../config/apiUrl'


// #37D65F

export default function Login() {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const toast = useToast()

    console.log(errorMessage)

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const { data: loginData } = await axios.post(`${apiUrl()}/auth/login`, data);

            if(loginData.error) {
                toast({
                    title: 'Неправильный логин или пароль',
                    status: 'error',
                    duration: 10000,
                    isClosable: true
                })
            } else {
                Cookies.set('auth-token', loginData.token)
                setIsSuccess(true)
            }
        } catch (e) {
            toast({
                title: 'Произошла ошибка: '+ e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Container mt='20px'>
            <Box>
                <Heading size='xl'>Авторизация</Heading>
                <Box mt='20px'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <Input id='email' type='email' required='required' {...register('email')} />
                        <FormHelperText>Email, который Вы указали при регистрации</FormHelperText>
                    </FormControl>
                    <FormControl mt='20px'>
                        <FormLabel htmlFor='password'>Пароль</FormLabel>
                        <Input id='password' type='password' required='required' {...register('password')} />
                        <FormHelperText>Тот самый, который Вы указали при регистрации</FormHelperText>
                    </FormControl>
                    <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>Войти</Button>
                    </form>
                    <Text mt='10px'>Нет аккаунта? <Link color='gray' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/register'>Зарегистрироваться</Link></Text>
                </Box>
            </Box>
            {isSuccess && (
                window.location.href = ''
            )}
        </Container>
    )
}