import {
    Box,
    Heading,
    Text,
    Container,
    SimpleGrid,
    Center,
} from '@chakra-ui/react'
import spotify from '../../assets/spotify.svg'
import vkmusic from '../../assets/vkmusic.svg'
import apple from '../../assets/apple.svg'
import yandex from '../../assets/yandex.svg'
import youtube from '../../assets/youtube.svg'
import deezer from '../../assets/deezer.svg'
import Partner from './Partner'

export default function Partners() {
    return (
        <Box ml={['40px', '100px']} mr={['40px', '100px']} mb='40px'>
            <Container maxW='full'>
            <Heading size='xl'>Дистрибуция на крупнейшие музыкальные площадки</Heading>
            <Text mt='10px' fontSize='xl'>На сегодняшний день мы работаем с основными цифровыми магазинами и музыкальными сервисами. Список наших партнёров постоянно растёт.</Text>
            <SimpleGrid m='40px' columns={[1, 2, 3]} spacing='10px'>
                <Partner logo={spotify} />
                <Partner logo={vkmusic} />
                <Partner logo={apple} />
                <Partner logo={yandex} />
                <Partner logo={youtube} />
                <Partner logo={deezer} />
            </SimpleGrid>
            <Center><Text color='gray' fontSize='lg' fontWeight='bold'>И еще 50+ площадок</Text></Center>
            </Container>
        </Box>
    )
}