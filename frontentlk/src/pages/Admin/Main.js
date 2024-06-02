import {
    Box,
    Link,
    Heading,
} from '@chakra-ui/react';
import {Link as RLink} from 'react-router-dom';

export default function Main() {
    return (
        <Box>
            <Box m='40px' borderWidth='1px' borderRadius='lg' bgColor='white'>
                <Box m='40px'>
                    <Heading>👋 Привет, админ!</Heading>
                    <Link fontSize='xl' _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={RLink} to='/admin/catalog'>Перейти в Каталог</Link>
                </Box>
            </Box>
        </Box>
    )
}