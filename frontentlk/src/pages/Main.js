import {
    Box,
} from '@chakra-ui/react';
import Hero from '../sections/Index/Hero'
import Features from '../sections/Index/Features'
import Partners from '../sections/Index/Partners'
import Footer from '../sections/Index/Footer'
import LK from '../sections/Index/LK'
import How from '../sections/Index/How'
import Contacts from '../sections/Index/Contacts'

export default function Main() {
    return (
        <Box>
            <Hero />
            <Features />
            <LK />
            <Partners />
            <How />
            <Contacts />
        </Box>
    )
}