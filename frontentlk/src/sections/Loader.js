import { Progress, Box } from '@chakra-ui/react'

export default function Loader() {
    return (
        <Box m='40px'>
            <Progress size='xs' colorScheme='red' isIndeterminate />
        </Box>
    )
}