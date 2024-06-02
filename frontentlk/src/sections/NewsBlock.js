import {
    Box,
    Heading,
    Text,
    Collapse,
    Link
} from '@chakra-ui/react';
import { useState } from 'react';
import parse from 'html-react-parser'

export default function NewsBlock(props) {
    const {title, body, date} = props

    const [show, setShow] = useState(false)

    const handleToggle = () => setShow(!show)

    return (
        <Box mt='20px' borderWidth='1px' borderRadius='lg' bgColor='white'>
            <Box m='40px'>
                <Heading mb='10px'>{title}</Heading>
                <Text fontSize='xl' mb='10px'>
                    <Collapse startingHeight={30} in={show}>
                        {parse(body)}
                    </Collapse>
                </Text>
                <Link color='red' mt='40px' mb='40px' _hover={{ color: '#820101' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={handleToggle}>{show ? 'Скрыть' : 'Читать всю новость'}</Link>

                <Text fontSize='sm'>{date}</Text>
            </Box>
        </Box>
    )
}