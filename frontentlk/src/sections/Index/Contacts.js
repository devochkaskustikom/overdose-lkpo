import {
    Box,
    Heading,
    Text,
    Link,
    Container,
    SimpleGrid,
    Divider
} from '@chakra-ui/react'

export default function Contacts() {
    return (
        <Box m='40px' mt='80px' ml={['40px', '100px']} mr={['40px', '100px']}>
            <Container maxW='full'>
                <Heading size='xl'>Контакты</Heading>
                <Divider mt='10px' />
                <SimpleGrid mt='20px' columns={[1, 2, 3]} spacing='20px'>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>Email</Heading>
                            <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={Link} href='mailto:info@overdose.media' isExternal>info@overdose.media</Link>
                        </Box>
                    </Box>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>ВКонтакте</Heading>
                            <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={Link} href='https://vk.com/overdose.media' isExternal>https://vk.com/overdose.media</Link>
                        </Box>
                    </Box>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='40px'>
                            <Heading>Telegram</Heading>
                            <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} as={Link} href='https://t.me/overdosemedia' isExternal>https://t.me/overdosemedia</Link>
                        </Box>
                    </Box>
                </SimpleGrid>
            </Container>
        </Box>
    )
}