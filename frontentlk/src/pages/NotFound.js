import {
    Box,
    Container,
    Stack,
    Heading,
    Link
} from '@chakra-ui/react';
import {
    Link as RLink
} from 'react-router-dom';

export default function NotFound() {
    return (
        <Container>
            <Stack
                as={Box}
                alignItems='center'
                textAlign={'center'}
                spacing={{ base: 8 }}
                py={{ base: 20, md: 36 }}
            >
                <Heading size='2xl'>Страница не найдена</Heading>
                <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/'>На главную</Link>
            </Stack>
        </Container>
    )
}