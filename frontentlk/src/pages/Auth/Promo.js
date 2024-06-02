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
                  <Photo isView id={params.id} />
                </Suspense>
              </TabPanel>
              <TabPanel>
                <Suspense fallback={<Loader />}>
                  <Main isView id={params.id} />
                </Suspense>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}
    </Box>
  );
}
