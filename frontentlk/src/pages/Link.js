import { 
    Container, Heading, Box, Image, Link as ChakraLink, Center, Skeleton
} from '@chakra-ui/react';
import { useParams, Navigate } from "react-router-dom";
import axios from 'axios';
import LinkButton from '../sections/LinkButton'
import { ReactComponent as YTIcon } from '../assets/platforms/yt.svg'
import { ReactComponent as SPIcon } from '../assets/platforms/spotify.svg'
import { ReactComponent as VKIcon } from '../assets/platforms/vk.svg'
import { ReactComponent as YAIcon } from '../assets/platforms/yandex.svg'
import { ReactComponent as APIcon } from '../assets/platforms/apple.svg'
import { ReactComponent as SCIcon } from '../assets/platforms/soundcloud.svg'
import { ReactComponent as ITIcon } from '../assets/platforms/itunes.svg'
import { ReactComponent as TLIcon } from '../assets/platforms/tidal.svg'
import { ReactComponent as DRIcon } from '../assets/platforms/deezer.svg'
import { useState, useEffect } from 'react';
import '../assets/Link.css'
import logo from '../assets/full_logo.svg'
import apiUrl from '../config/apiUrl'
import not_found from '../assets/not_found.svg'



function Link() {
    let params = useParams();

    const [link, setLink] = useState({});
    const [loaded, setLoaded] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [last, setLast] = useState(null);
    useEffect(() => {
        setLast(params.id)
        const loading = async () => {
            const {data: ip} = await axios.get('https://ipapi.co/json/')
            const data = await axios.get(`${apiUrl()}/get_link?id=${params.id}&ip=${ip.ip}`)

            if(data.data.error) {
                setNotFound(true)
            }
            document.title = `${data.data.link.artists} - ${data.data.link.title} | overdose.media`

            setLink(data.data.link)
            setLoaded(true);
        }
        if(!loaded) {    
            loading()
        }
    }, []);

    return (

    <Container maxW='md' id='link'>
        <Skeleton isLoaded={loaded}>
        <Image src={`${apiUrl()}${link.cover}`} className='bgImage' sizes='100vw'></Image>
        {notFound && (
            <Navigate to='/404' />
        )}
        <Box className='linkContent' borderRadius='1px' w='auto' mb='20px' h='10%' >
        <Image 
            src={`${apiUrl()}${link.cover}`}
            fallbackSrc={not_found}
            w='416px'
            h='416px'
            draggable='false'
            id='cover'
        />
        <Box
        boxShadow='dark-lg' p='6' bg='#f9fafb'
        >
            <Heading size='lg' id='title'>{link.title}</Heading>
            <Heading size='md' id='artists'>{link.artists}</Heading>
        </Box>
        <Box
        boxShadow='dark-lg' p='6' bg='#f9fafb'
         hidden='' id='platforms' textAlign='center'>
            {link.apple && (
                <LinkButton name='Apple Music' link={link.apple} icon={<APIcon />} />
            )}
            {link.vk && (
                <LinkButton name='VK Музыка' link={link.vk} icon={<VKIcon />} />
            )}
            {link.yandex && (
                <LinkButton name='Яндекс Музыка' link={link.yandex} icon={<YAIcon />} />
            )}
            {link.yt_music && (
                <LinkButton name='YouTube Music' link={link.yt_music} icon={<YTIcon />} />
            )}
            {link.spotify && (
                <LinkButton name='Spotify' link={link.spotify} icon={<SPIcon />} />
            )}
            {link.soundcloud && (
                <LinkButton name='SoundCloud' link={link.soundcloud} icon={<SCIcon />} />
            )}
            {link.itunes && (
                <LinkButton name='iTunes' link={link.itunes} icon={<ITIcon />} />
            )}
            {link.tidal && (
                <LinkButton name='Tidal' link={link.tidal} icon={<TLIcon />} />
            )}
            {link.deezer && (
                <LinkButton name='Deezer' link={link.deezer} icon={<DRIcon />} />
            )}
            <Center>
            <ChakraLink href='https://overdose.media' isExternal>
                <Image src={logo} draggable={false} w='150px'></Image>
            </ChakraLink>
            </Center>
        </Box>
        </Box>
        </Skeleton>
    </Container>
    )
}

export default Link;