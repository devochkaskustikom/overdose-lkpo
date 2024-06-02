import {
    Box,
    Container,
    Stack,
    Heading,
    Text,
    Button,
} from '@chakra-ui/react';
import {Link as RLink} from 'react-router-dom';

export default function Hero() {
    return (
        <Container maxW='4xl'>
            <Stack
                as={Box}
                alignItems='center'
                textAlign={'center'}
                spacing={{ base: 4 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading size='3xl'>Твой помощник в дистрибуции</Heading>
                <Text fontSize='xl'>Сервис цифровой дистрибуции для независимых артистов</Text>
                <Button color='red' size='lg' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} as={RLink} to='/register'>
                    Создать аккаунт
                </Button>
            </Stack>
        </Container>
    )
}