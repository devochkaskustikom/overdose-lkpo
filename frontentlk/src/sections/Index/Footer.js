import { Container, Text, Link, SimpleGrid, Box } from '@chakra-ui/react'
import { Link as RLink } from 'react-router-dom';

function Footer() {
    return (
        <Container
            as="footer"
            role="contentinfo"
            py={{
            base: '12',
            md: '16',
            }}
            textAlign='center'
            maxW='full'
            bgColor='white'
            mt='100px'
        >
            <SimpleGrid columns={[1, 2, 3]} spacing='10px'>
                <Box>
                    <Text fontWeight="bold" color="black">Контакты</Text>
                    <Text mt='10px'><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} href='mailto:info@overdose.media' isExternal>
                        info@overdose.media
            </Link><br/><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} href='https://vk.com/overdose.media' isExternal>
                        ВКонтакте
            </Link><br/><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} href='https://t.me/overdosemedia' isExternal>
                        Telegram
            </Link></Text>
                </Box>
                <Text fontWeight="bold" color="black">
                    &copy; {new Date().getFullYear()} overdose.media
                </Text>
                <Box>
                    <Text fontWeight="bold" color="black">Полезные ссылки</Text>
                    <Text mt='10px'><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} as={RLink} to='/terms/privacy'>
            Политика конфиденциальности
            </Link><br/><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} as={RLink} to='/terms/terms'>
            Пользовательское соглашение
            </Link><br/><Link _hover={{'color': 'red', 'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important', 'text-decoration': 'underline' }} as={RLink} to='/terms/partners'>
            Партнеры
            </Link></Text>
                </Box>
            </SimpleGrid>
        </Container>
    )
}

export default Footer;