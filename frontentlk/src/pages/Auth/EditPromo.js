import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import {
  SimpleGrid,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  useToast,
  Image,
  Text,
  Container,
  RadioGroup,
  HStack,
  Radio,
  Select,
  Textarea,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Center,
  Link,
  ModalFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import not_found from "../../assets/not_found.svg";
import { useParams, Navigate } from "react-router-dom";
import FilePicker from "chakra-ui-file-picker";
import Track from "../../sections/Track";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { lazy, Suspense } from "react";

const Photo = lazy(() => import("../../sections/Promo/Photo"));
const Main = lazy(() => import("../../sections/Promo/Main"));

export default function Edit() {
  let params = useParams();

  const [promo, setPromo] = useState();
  const [release, setRelease] = useState();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [notFound, setNotFound] = useState(false);

  const toast = useToast();

  const getprice = async () => {
    const data = await axios.get(`${apiUrl()}/user/promo_price`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    if (data.data.error) {
      setNotFound(true);
    } else {
      setPrice(data.data.price);
    }
  };

  const getpromo = async () => {
    const data = await axios.get(`${apiUrl()}/user/get_promo?id=${params.id}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });
    if (data.data.error) {
      setNotFound(true);
    } else {
      setPromo(data.data.promo);
      setRelease(data.data.release);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) {
      getpromo();
      getprice();
    }
  }, []);
  const { register, handleSubmit } = useForm();

  const uploadCover = async (files) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", files[0]);
      formData.append("id", params.id);
      const data = await axios.post(`${apiUrl()}/user/promo_edit`, formData, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (data.data.error) {
        toast({
          title: `Произошла ошибка!`,
          description: `${data.data.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Фото загружено!`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: `Произошла ошибка!`,
        description: `${e}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    getpromo();
    setIsLoading(false);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl()}/user/promo_edit`, data, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (response.data.error) {
        toast({
          title: `Произошла ошибка!`,
          description: `${response.data.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Промо сохранено`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: `Произошла ошибка!`,
        description: e,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    getpromo();
    setIsLoading(false);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const send_promo = async () => {
    setIsLoading(true);
    try {
      const form = document.getElementById("main");

      const FD = new FormData(form);

      await axios.post(`${apiUrl()}/user/promo_edit`, FD, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });

      getpromo();

      const response = await axios.post(
        `${apiUrl()}/user/promo_send`,
        { id: params.id },
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response.data.error) {
        toast({
          title: `Произошла ошибка!`,
          description: `${response.data.error}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        getpromo();
        onOpen();
      }
    } catch (e) {
      toast({
        title: `Произошла ошибка!`,
        description: e,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  const Loader = () => (
    <Center>
      <Spinner color="red" size="xl" />
    </Center>
  );

  return (
    <Box m="40px">
      {notFound && <Navigate to="/404" />}
      {!loaded && (
        <Center>
          <Spinner color="red" size="xl" />
        </Center>
      )}
      {loaded && (
        <Container>
          <Heading mb="10px">{release.title}</Heading>
          <Tabs variant="soft-rounded" colorScheme="red" isLazy>
            <TabList>
              <Tab>Фотография</Tab>
              <Tab>Информация</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Suspense fallback={<Loader />}>
                  <Photo id={params.id} />
                </Suspense>
              </TabPanel>
              <TabPanel>
                <Suspense fallback={<Loader />}>
                  <Main id={params.id} />
                </Suspense>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}
      {/* {loaded && (
                <Box>
                <SimpleGrid mt='10px' columns={[1, 2]} spacing='10px'>
                <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Фотография артиста</Heading>
                        <Image mt='10px' mb='10px' src={`${apiUrl()}${promo.photo}`} fallbackSrc={not_found} w='300px' h='300px' borderWidth='2px' borderRadius='lg' />
                        <FilePicker
                            onFileChange={(fileList) => { uploadCover(fileList) }}
                            placeholder="Загрузите фотографию"
                            clearButtonLabel="label"
                            multipleFiles={false}
                            accept="image/*"
                            hideClearButton={true}
                        />
                        <Text mt='20px'><b>Требования к фотографии:</b><br /><br/>-файл в формате JPG или PNG размером не менее 2400x2400 пикселей. Т.е. нужна квадратная компоновка кадра т.к. аватарка квадратная или круглая, а из прямоугольной фотографии не всегда получается корректно, без отрезания рук и ног вырезать квадрат. От верхнего края фотографии до значимых частей изображения (головы, лица) должно быть около 500 пикселей. Как будет выглядеть изображение артиста на смартфонах можно посмотреть здесь{' '}
<Link _hover={{ color: 'red' }} _active={{ boxShadow: 'none!important', color: 'red' }} _focus={{ boxShadow: 'none!important', color: 'red' }}  href='https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view' isExternal>https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view</Link>{' '}
предварительно вставив изображение артиста отдельным слоем.<br/>
Особо обратите внимание, чтобы брови артиста были не выше верхней желтой линии, а губу - не ниже нижней. Apple сейчас прогоняет все фото через этот шаблон и часто отказывает именно по этой причине
<br/><br/>
- Изображение должно быть в цветовом пространстве RGB с разрешением не менее 72 точек на дюйм (dpi). Не увеличивайте масштаб изображения, если его размер меньше необходимого. Используйте изображение только в том случае, если Вы имеете право предоставить его в общий доступ по всему миру.<br/>
- фото не должно совпадать ни с одной из обложек дисков,<br/>
- на фото не должно быть надписей,<br/>
- на фото не должно быть рамок или полос сверху и снизу
</Text>
                    </Box>
                </Box>
                <Box borderWidth='1px' borderRadius='lg' bgColor='white'>
                    <Box m='40px'>
                        <Heading>Основная информация</Heading>
                        <Text fontSize='sm'>* - обязательное поле</Text>
                        <form onSubmit={handleSubmit(onSubmit)} id='main'>
                            <Input hidden='hidden' value={params.id} {...register('id')} />
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='title'>Название релиза</FormLabel>
                                <Input id='title' defaultValue={release.title} placeholder='Название релиза' type='text' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px' mb='10px'>
                                <FormLabel htmlFor='artists'>Артисты</FormLabel>
                                <Input  defaultValue={release.artists}  placeholder='Перечислите артистов через запятую' type='text' isReadOnly />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='desc'>* Описание релиза</FormLabel>
                                <Textarea id='desc' defaultValue={promo.desc} placeholder='Описание релиза (3-4 предложения)' type='text' {...register('desc')} />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='social'>* Социальные сети артиста</FormLabel>
                                <Textarea id='social' defaultValue={promo.social} placeholder='Перечислите через запятую' type='text' {...register('social')} />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='promo'>Дальнейшее продвижение (если будет)</FormLabel>
                                <Textarea id='promo' defaultValue={promo.promo} placeholder='Опишите дальнейшее продвижение' type='text' {...register('promo')} />
                            </FormControl>
                            <FormControl mt='10px'>
                                <FormLabel htmlFor='focus'>Название фокус трека (обязательно если в релизе больше одного трека)</FormLabel>
                                <Input id='focus' defaultValue={promo.focus} placeholder='Введите название трека' type='text' {...register('focus')} />
                            </FormControl>
                            <ButtonGroup w='100%' mt='10px'>
                                <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} type='submit' isLoading={isLoading}>
                                    Сохранить
                                </Button>
                                <Button w='100%' color='red' border='1px' bgColor='white' borderColor='red' _hover={{ color: 'white', bgColor: 'red' }} _focus={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} _active={{ boxShadow: 'none!important', color: 'white', bgColor: 'red' }} onClick={() => {send_promo()}} isLoading={isLoading}>
                                    Отправить
                                </Button>
                            </ButtonGroup>
                        </form>
                    </Box>
                </Box>
            </SimpleGrid> */}
    </Box>
  );
}
