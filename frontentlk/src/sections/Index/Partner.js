import {
    Box,
    Image,
    Container,
} from '@chakra-ui/react'
import React from 'react'

export default function Partner(props) {
    const {logo} = props

    return (
            <Box borderWidth='1px' alignItems='center' textAlign={'center'} alignContent='center' borderRadius='lg' bgColor='white'>
                <Box as={Container} alignItems='center' textAlign={'center'} alignContent='center'>
                    <Image draggable={false} w='100%' h='100%' src={logo} />
                </Box>
            </Box>
    )
}