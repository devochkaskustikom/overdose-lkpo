import { 
    Box, Button, Link as ChakraLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';

export default function LinkButton(props) {
    return (
        <Button href={props.link} _hover={{ bg: '#f3f4f6', textDecoration: 'none' }} color='#6B7280' borderColor='red' _focus={{ boxShadow: 'none!important' }} variant='outline' w='100%' isExternal as={ChakraLink} leftIcon={props.icon} h='60px' marginBottom='20px' justifyContent="flex-start" >
            <Box justifyContent='space-between' w='100%'>            
                {props.name}
            </Box>
            <Box>
                <ChevronRightIcon w='24px' h='24px' />
            </Box>
        </Button>
    )
}