import {
    Box,
    Text,
    Heading
} from '@chakra-ui/react'

export default function Feature(props) {
    const {title, about} = props
    return (
        <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
            <Box m='40px'>
                <Heading>{title}</Heading>
                <Text mt='10px'>{about}</Text>
            </Box>
        </Box>
    )
}