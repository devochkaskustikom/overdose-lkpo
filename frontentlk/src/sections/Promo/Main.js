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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ModalFooter,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import not_found from "../../assets/not_found.svg";
import FilePicker from "chakra-ui-file-picker";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Navigate } from "react-router-dom";

export default function Cover(props) {
  const [promo, setPromo] = useState();
  const [release, setRelease] = useState();
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [pay, setPay] = useState(false);
  const toast = useToast();
  const { isView, isAdmin } = props;
  let uri = "user";
  if (isAdmin) {
    uri = "admin";
  }
  const getpromo = async () => {
    const data = await axios.get(
      `${apiUrl()}/${uri}/get_promo?id=${props.id}`,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (data.data.error) {
      toast({
        title: `Произошла ошибка!`,
        description: `${data.data.error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setPromo(data.data.promo);
      setRelease(data.data.release);
      setLoaded(true);
    }
  };
  const getprice = async () => {
    const data = await axios.get(`${apiUrl()}/user/promo_price`, {
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
      setPrice(data.data.price);
    }
  };
  useEffect(() => {
    if (!loaded) {
      getpromo();
      getprice();
    }
  }, []);
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
  const { register, handleSubmit } = useForm();
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
        { id: props.id },
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
        description: `${e}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const checkPay = async () => {
    setIsLoading(true);
    try {
      const { data: data } = await axios.get(
        `${apiUrl()}/user/promo_success?id=${props.id}`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (data.error) {
        toast({
          title: `Оплата не найдена.`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setPay(true);
      }
      setLoaded(true);
    } catch (e) {
      toast({
        title: `Произошла ошибка!`,
        description: `${e}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Box>
      {(!loaded && (
        <Center>
          <Spinner color="red" size="xl" />
        </Center>
      )) || (
        <Box>
          {pay && <Navigate to={`/promo/success/${promo.id}`} />}
          <Heading>Основная информация</Heading>
          <Text fontSize="sm">* - обязательное поле</Text>
          <form onSubmit={handleSubmit(onSubmit)} id="main">
            <Input hidden="hidden" value={props.id} {...register("id")} />
            <FormControl mt="10px">
              <FormLabel htmlFor="title">Название релиза</FormLabel>
              <Input
                id="title"
                defaultValue={release.title}
                placeholder="Название релиза"
                type="text"
                isReadOnly
              />
            </FormControl>
            <FormControl mt="10px" mb="10px">
              <FormLabel htmlFor="artists">Артисты</FormLabel>
              <Input
                defaultValue={release.artists}
                placeholder="Перечислите артистов через запятую"
                type="text"
                isReadOnly
              />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel htmlFor="desc">* Описание релиза</FormLabel>
              <Textarea
                id="desc"
                defaultValue={promo.desc}
                placeholder="Описание релиза (3-4 предложения)"
                type="text"
                isReadOnly={isView}
                {...register("desc")}
              />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel htmlFor="social">* Социальные сети артиста</FormLabel>
              <Textarea
                id="social"
                defaultValue={promo.social}
                placeholder="Перечислите через запятую"
                type="text"
                isReadOnly={isView}
                {...register("social")}
              />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel htmlFor="promo">
                Дальнейшее продвижение (если будет)
              </FormLabel>
              <Textarea
                id="promo"
                defaultValue={promo.promo}
                placeholder="Опишите дальнейшее продвижение"
                type="text"
                isReadOnly={isView}
                {...register("promo")}
              />
            </FormControl>
            <FormControl mt="10px">
              <FormLabel htmlFor="focus">
                Название фокус трека (обязательно если в релизе больше одного
                трека)
              </FormLabel>
              <Input
                id="focus"
                defaultValue={promo.focus}
                placeholder="Введите название трека"
                type="text"
                isReadOnly={isView}
                {...register("focus")}
              />
            </FormControl>
            {!isView && (
              <ButtonGroup w="100%" mt="10px">
                <Button
                  w="100%"
                  color="red"
                  border="1px"
                  bgColor="white"
                  borderColor="red"
                  _hover={{ color: "white", bgColor: "red" }}
                  _focus={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  type="submit"
                  isLoading={isLoading}
                >
                  Сохранить
                </Button>
                <Button
                  w="100%"
                  color="red"
                  border="1px"
                  bgColor="white"
                  borderColor="red"
                  _hover={{ color: "white", bgColor: "red" }}
                  _focus={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  onClick={() => {
                    send_promo();
                  }}
                  isLoading={isLoading}
                >
                  Отправить
                </Button>
              </ButtonGroup>
            )}
          </form>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Отправка промо</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>
                  Отправка промо стоит {price} рублей. Внимательно проверьте все
                  поля перед оплатой, после оплаты редактирование будет
                  недоступно.
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  onClick={onClose}
                  w="100%"
                  color="red"
                  border="1px"
                  bgColor="white"
                  borderColor="red"
                  mr={3}
                  _hover={{
                    textDecoration: "none",
                    color: "white",
                    bgColor: "red",
                  }}
                  _focus={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                  }}
                  isLoading={isLoading}
                  as={Link}
                  href={promo.pay_link}
                >
                  Оплатить
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={onClose}
                  w="100%"
                  color="white"
                  border="1px"
                  bgColor="red"
                  borderColor="red"
                  _hover={{
                    textDecoration: "none",
                    color: "white",
                    bgColor: "#c90202",
                    borderColor: "#c90202",
                  }}
                  _focus={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                    borderColor: "red",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    color: "white",
                    bgColor: "red",
                    borderColor: "red",
                  }}
                  onClick={checkPay}
                  isLoading={isLoading}
                >
                  Я уже оплатил
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      )}
    </Box>
  );
}
