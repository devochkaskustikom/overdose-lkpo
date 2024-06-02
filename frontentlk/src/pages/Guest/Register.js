import {
    Box,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Container,
    Heading,
    Text,
    Button,
    Link,
    useToast,
} from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import apiUrl from '../../config/apiUrl'

export default function Register() {
    const { register, handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const toast = useToast()

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            const { data: loginData } = await await axios.post(`${apiUrl()}/auth/register`, data);

            if(loginData.error) {
                setErrorMessage('Такой пользователь уже существует')
                setTimeout(200, toast({
                    title: 'Такой пользователь уже существует',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                }))
                
            } else {
                Cookies.set('auth-token', loginData.token)
                setIsSuccess(true)
            }

            
        } catch (e) {
            setErrorMessage('Произошла ошибка: '+ e)
            setTimeout(200, toast({
                title: 'Произошла ошибка: '+ e,
                status: 'error',
                duration: 3000,
                isClosable: true,
            }))
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Container mt='20px'>
            <Box>
                <Heading size='xl'>Регистрация</Heading>
                <Box mt='20px'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel htmlFor='name'>Ваше имя</FormLabel>
                        <Input id='name' type='name' required='required' {...register("name")} />
                    </FormControl>
                    <FormControl mt='20px'>
                        <FormLabel htmlFor='email'>Ваш Email</FormLabel>
                        <Input id='email' type='email' required='required' {...register("email")} />
                        {errorMessage && (
                            <FormErrorMessage>{errorMessage}</FormErrorMessage>
                        )}
                    </FormControl>
                    <FormControl mt='20px'>
                        <FormLabel htmlFor='username'>Придумайте логин</FormLabel>
                        <Input id='username' type='text' required='required' {...register("username")} />
                        <FormErrorMessage>{errorMessage}</FormErrorMessage>
                    </FormControl>
                    <FormControl mt='20px'>
                        <FormLabel htmlFor='password'>Придумайте пароль</FormLabel>
                        <Input id='password' type='password' required='required' {...register("password")} />
                    </FormControl>
                    <Button mt='10px' w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>Зарегистрироваться</Button>
                    <Text mt='10px'>Нажимая кнопку "Зарегистрироваться" вы соглашаетесь с <Link color='gray' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/terms/privacy'>политикой конфиденциальности</Link> и с <Link color='gray' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/terms/terms'>пользовательским соглашением</Link></Text>
                    </form>
                    <Text mt='10px'>Уже есть аккаунт? <Link color='gray' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/login'>Войти</Link></Text>
                </Box>
            </Box>
            {isSuccess && (
                window.location.href = ''
            )}
        </Container>
    )
}