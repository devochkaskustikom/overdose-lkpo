import {
    Box,
    Container,
    Heading,
    Link,
    Text,
    SimpleGrid
} from '@chakra-ui/react'

export default function Help() {
    return (
        <Container maxW='3xl'>
            <Heading>Помощь</Heading>
            <Text>Чтобы обратиться в поддержку, выберите удобный способ связи</Text>
            <SimpleGrid mt='20px' columns={[1, 2]} spacing='30px'>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='20px'>
                            <Heading>Email</Heading>
                            <Link color='gray' textDecoration='none' _hover={{ color: 'red', textDecoration: 'none' }} _active={{ boxShadow: 'none!important' }} _focus={{ boxShadow: 'none!important' }} as={Link} href='mailto:support@overdose.media' isExternal>support@overdose.media</Link>
                        </Box>
                    </Box>
                    <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                        <Box m='20px'>
                            <Heading>ВКонтакте</Heading>
                            <Link color='gray' textDecoration='none' _hover={{ color: 'red', textDecoration: 'none' }} _active={{ boxShadow: 'none!important' }} _focus={{ boxShadow: 'none!important' }} as={Link} href='https://vk.me/overdose.media' isExternal>https://vk.com/overdose.media</Link>
                        </Box>
                    </Box>
                </SimpleGrid>
        </Container>
    )
}