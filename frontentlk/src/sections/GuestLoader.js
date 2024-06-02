import {
    Spinner,
    Box,
    Container,
    Center
} from '@chakra-ui/react'

export default function GuestLoader() {
    return (
        <Container>
            <Center>
                <Spinner size='xl' color='red' />
            </Center>
        </Container>
    )
}