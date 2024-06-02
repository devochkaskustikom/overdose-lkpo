import {
    Box,
    Link,
    Heading,
    Text,
    Container,
    Flex,
    Image,
    Spinner,
    useToast,
    UnorderedList,
    ListItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    OrderedList,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrl from '../../config/apiUrl'
import getToken from '../../config/getToken'
import {Link as RLink, useNavigate} from 'react-router-dom';

export default function NewPromo() {
    const [releases, setReleases] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [prelease, setRelease] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const getReleases = async () => {
        const data = await axios.get(`${apiUrl()}/user/get_releases`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })

        setReleases(data.data.releases)
        setLoaded(true)
    }

    const [price, setPrice] = useState(0)
    const [oldPrice, setOldPrice] = useState(0)

    const getPrice = async () => {
        const data = await axios.get(`${apiUrl()}/user/promo_price`, {
            headers: {
              'authorization': `Bearer ${getToken()}`
            }
        })
        setPrice(data.data.price)
        setOldPrice(data.data.old_price)
    }
    useEffect(() => {
        if(!loaded) {    
            getReleases()
            getPrice()
        }
    }, [])
    const toast = useToast()
    let navigate = useNavigate()



    const new_promo = async (r_id) => {
        setLoaded(false)
        try {
            const {data: data} = await axios.post(`${apiUrl()}/user/promo_create`, {id: r_id}, {
                headers: {
                    'authorization': `Bearer ${getToken()}`
                } 
            })
            if(data.error) {
                toast({
                    title: 'Произошла ошибка!',
                    description: `${data.error}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                navigate(`/promo/edit/${data.promo.id}`)
            }
        } catch(e) {
            toast({
                title: 'Произошла ошибка!',
                description: `${e}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        setLoaded(true)
    }
    return (
        <Box alignItems='center' textAlign='center'>
            <Heading>Выберите релиз для промо</Heading>
            <Link onClick={onOpen} _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }}>Как это работает?</Link>
            <Container mt='20px'>
                {!loaded && (
                    <Spinner size='xl' color='red' />
                ) || (
                    <Box alignItems='left' textAlign='left'>
                    {releases.map((release) => {
                        return (
                            <Box>
                                {release.status === 'ok' && (
                                    <Box borderWidth='1px' borderRadius='lg' bgColor='white' mb='20px'>
                                        <Flex m='20px'>
                                            <Box mr='20px' onClick={() => {setRelease(release); new_promo()}}>
                                                <Image borderWidth='1px' borderRadius='lg' src={`https://img.gs/lprfwxwbrz/100x100/${apiUrl()}${release.cover}`} w='100px' h='100px'></Image>
                                            </Box>
                                            <Box>
                                                <Heading><Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {new_promo(release.id)}}>{release.title}</Link></Heading>
                                                <Heading size='sm'><Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }} onClick={() => {setRelease(release); new_promo()}}>{release.artists}</Link></Heading>
                                            </Box>
                                        </Flex>
                                    </Box>
                                )}
                            </Box>
                        )
                    })}
                    </Box>
                )}
            </Container>
            <Modal scrollBehavior='outside' isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Информация о промо</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            Промо поддержка заключается в аккумулировании необходимой информации и предоставлении рекомендаций и материалов маркетинговым командам музыкальных сервисов. Иными словами, мы отправляем твой релиз редакторам всех площадок, чтобы трек имел возможность попасть на витрины и плейлисты.<br/><br/>
                            Мы отправляем рекомендации для продвижения контента в следующие музыкальные сервисы:
                        </Text>
                        <UnorderedList>
                            <ListItem>Интернет сервисы: Apple Music/iTunes, Яндекс.Музыка, СберЗвук, Deezer, Музыка ВКонтакте/BOOM, Spotify и YouTube Music.</ListItem>
                            <ListItem>Музыкальные сервисы операторов сотовой связи: Билайн Музыка (Россия), Билайн Музыка (Узбекистан), Mobi Music (Казахстан), МТС Музык</ListItem>
                            <ListItem>РБТ (ринг бэк тон) сервисы операторов сотовой связи: Билайн, Теле2, МТС, Мегафон, а также ряд РБТ сервисов в странах СНГ.</ListItem>
                        </UnorderedList>
                        <Text mt='10px'>
                            Для того чтобы максимально полно и эффективно предоставить информацию о приоритетном релизе музыкальным сервисам необходимо выполнить два важных шага:
                        </Text>
                        <OrderedList>
                            <ListItem><b>Отправить нам Релиз за три недели до даты выхода трека на музыкальных площадках, чтобы он был вовремя доставлен и прошел необходимую модерацию.</b><br/><br/> Стандартный день релизов — это пятница, когда практически все сервисы обновляют свои витрины. Рекомендации подаются каждую неделю: по понедельникам-вторникам.<br/><br/>Минимальный срок подачи в рекомендации релиза это 14 рабочих дней. Т.е. если вы планируете релиз своей песни или альбома на пятницу 3 июня 2022 года, данный релиз должен быть загружен не позже 20 мая. Чем раньше вы отправите информацию о готовящихся приоритетных новинках, тем больше времени будет у музыкальных сервисов ознакомиться с релизами.</ListItem>
                            <ListItem><b>Предоставить необходимую маркетинговую информацию по релизу.</b><br/><br/>Информация может содержать в себе:<br/><br/>
                                <UnorderedList>
                                    <ListItem>Описание альбома/песни (пресс-релиз). История создания.</ListItem>
                                    <ListItem>Будет ли какая-то промо поддержка релиза со стороны самого артиста или лейбла: возможный гастрольный тур в поддержку альбома, участие в радио эфирах, постановка на радио, возможные какие-то медийные истории, в которых будет коммуникация в сторону нового релиза, промо активности в социальных сетях. На какие музыкальные сервисы в своих маркетинговых коммуникациях артист или лейбл планирует делать упор.</ListItem>
                                    <ListItem>Фотография артиста в формате JPG или PNG размером не менее 2400x2400 пикселей.<br/><br/>Т.е. нужна квадратная компоновка кадра т.к. аватарка квадратная или круглая, а из прямоугольной фотографии не всегда получается корректно, без отрезания рук и ног вырезать квадрат. От верхнего края фотографии до значимых частей изображения (головы, лица) должно быть около 500 пикселей. Как будет выглядеть изображение артиста на смартфонах можно посмотреть здесь{' '}
                                    <Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }}  href='https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view' isExternal>https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view</Link>{' '}
                                    предварительно вставив изображение артиста отдельным слоем.<br/>
                                    Особо обратите внимание, чтобы брови артиста были не выше верхней желтой линии, а губу - не ниже нижней. Apple сейчас прогоняет все фото через этот шаблон и часто отказывает именно по этой причине</ListItem>
                                </UnorderedList>
                            </ListItem>
                        </OrderedList>
                        <Text mt='10px'>
                            В любом случае решение о постановке в продвижение принимается редакторскими командами музыкальных сервисов, но эти два основных правила позволят командам музыкальных сервисов обратить больше внимания на релиз.
                        </Text>
                        <Text mt='20px'>
                            Стоимость услуги - <Text as='s'>{oldPrice}</Text> {price} рублей.
                        </Text>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}