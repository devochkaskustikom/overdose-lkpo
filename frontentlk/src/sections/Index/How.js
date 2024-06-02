import {
    Box,
    Heading,
    Text,
    Container,
    SimpleGrid,
    Center,
    Button
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'

export default function How() {
    return (
        <Box mt='100px' ml={['40px', '100px']} mr={['40px', '100px']} mb='40px'>
            <Container maxW='full'>
                <Center>
                <Heading>Выпустить релиз легко!</Heading>
                </Center>
                <SimpleGrid mt='40px' columns={[1, 2, 3]} spacing='20px'>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>Создайте аккаунт</Heading>
                            <Text mt='10px'>Регистрация займет всего пару минут, после чего вы получите доступ к личному кабинету.</Text>
                            <Button mt='20px' w='100%' color='red' size='lg' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} as={Link} to='/register'>
                                Создать аккаунт
                            </Button>
                        </Box>
                    </Box>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>Загрузите релиз</Heading>
                            <Text mt={['10px', '40px']} fontSize='lg'>Перейди во вкладку "Новый релиз", заполни все обязательные поля и отправь релиз на модерацию.</Text>
                        </Box>
                    </Box>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>Готово!</Heading>
                            <Text mt={['10px', '40px']} fontSize='lg'>После модерации, мы отправим твой релиз на все площадки!</Text>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Container>
        </Box>
    )
}