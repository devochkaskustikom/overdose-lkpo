import {
    Box,
    Heading,
    Text,
    Image,
    SimpleGrid,
    Button
} from '@chakra-ui/react'
import screen_lk from '../../assets/screen_lk.png'
import {Link} from 'react-router-dom'

export default function LK() {
    return (
        <Box m='40px' ml={['40px', '100px']} mr={['40px', '100px']}>
            <SimpleGrid columns={[1, 2]} spacing={['20px', '0px']}>
                <Box>
                    <Heading size='xl'>Удобный личный кабинет</Heading>
                    <Text mt='20px' fontSize='xl'>Загрузка трека через личный кабинет нашего сервиса займет не более 2-ух минут. Комфортный интерфейс поможет тебе управлять релизами, отслеживать баланс.</Text>
                    <Button mt='20px' color='red' size='lg' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} as={Link} to='/register'>
                        Создать аккаунт
                    </Button>
                </Box>
                <Box>
                    <Image src={screen_lk} />
                </Box>
            </SimpleGrid>
        </Box>
    )
}