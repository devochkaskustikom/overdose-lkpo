import { useAudio } from "react-awesome-audio";
import {
    Tr,
    Td,
    Link,
    Spinner
} from '@chakra-ui/react'
import apiUrl from '../config/apiUrl'
import axios from 'axios'
import {useState} from 'react'
import fileDownload from 'js-file-download'

export default function Track(props) {
    const {track} = props
    const [isLoading, setIsLoading] = useState(false)
    const { isPlaying, toggle } = useAudio({
        src: `${apiUrl()}${track.wav}`,
        loop: false,
    });

    const download = () => {
        setIsLoading(true)
        axios.get(`https://api.codetabs.com/v1/proxy?quest=${apiUrl()}${track.wav}`, {
            responseType: 'blob',
        })
        .then((res) => {
            const name = `${track.artists} - ${track.title}.wav`

            fileDownload(res.data, name)
            setIsLoading(false)
        })
    }

    return (
        <Tr>
            <Td><button onClick={toggle}>{isPlaying ? <i className="bi bi-pause-circle"></i> : <i className="bi bi-play-circle"></i>}</button></Td>
            <Td>{track.title}</Td>
            <Td>{track.version || "Н/А"}</Td>
            <Td>{track.artists}</Td>
            <Td>{track.author}</Td>
            <Td>{track.composer}</Td>
            <Td>{track.explicit === 0 && 'Нет' || 'Да'} </Td>
            <Td>{!isLoading && (
                <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {
                    download()
                }}>Скачать</Link>
            ) || (
                <Spinner color='red'/>
            )}</Td>
        </Tr>
    )
}