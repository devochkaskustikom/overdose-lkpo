import {
    Box,
    SimpleGrid,
    Text,
    Container,
    Heading,
    Flex,
    Image
} from '@chakra-ui/react'
import Feature from './Feature'

export default function Features() {
    return (
        <Box>
            <SimpleGrid ml={['40px', '100px']} mr={['40px', '100px']} mb='100px' columns={[1, 2, 3]} spacing='10px'>
                <Feature title='Быстрая модерация' about='Мы проверим твой релиз и сразу отправим его на площадки. Средний срок загрузки релизов - 3 дня.' />
                <Feature title='Все крупнейшие магазины' about='Твой контент будет продаваться во всех самых крупных цифровых магазинах по всему миру.' />
                <Feature title='Абсолютно бесплатно' about='Просто создай новый релиз в личном кабинете, заполни все обязательные поля и отправь релиз на модерацию!' />
            </SimpleGrid>
        </Box>
    )
}