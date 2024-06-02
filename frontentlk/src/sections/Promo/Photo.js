import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import {
  Box,
  Heading,
  useToast,
  Image,
  Text,
  Spinner,
  Center,
  Link,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import not_found from "../../assets/user_not_found.svg";
import { useParams, Navigate } from "react-router-dom";
import FilePicker from "chakra-ui-file-picker";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Cover(props) {
  const [promo, setPromo] = useState();
  const [loaded, setLoaded] = useState(false);
  const { isView, isAdmin } = props;
  let uri = "user";
  if (isAdmin) {
    uri = "admin";
  }
  const toast = useToast();
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
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) {
      getpromo();
    }
  }, []);
  const uploadCover = async (files) => {
    try {
      const formData = new FormData();
      formData.append("photo", files[0]);
      formData.append("id", props.id);
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
  };
  return (
    <Box>
      {(!loaded && (
        <Center>
          <Spinner color="red" size="xl" />
        </Center>
      )) || (
        <Box>
          <Heading>Фотография артиста</Heading>
          <Image
            mt="10px"
            mb="10px"
            src={`${apiUrl()}${promo.photo}`}
            fallbackSrc={not_found}
            w="300px"
            h="300px"
            borderWidth="2px"
            borderRadius="lg"
          />
          {!isView && (
            <FilePicker
              onFileChange={(fileList) => {
                uploadCover(fileList);
              }}
              placeholder="Загрузите фотографию"
              clearButtonLabel="label"
              multipleFiles={false}
              accept="image/*"
              hideClearButton={true}
            />
          )}
          <Text mt="20px">
            <b>Требования к фотографии:</b>
            <br />
            <br />
            -файл в формате JPG или PNG размером не менее 2400x2400 пикселей.
            Т.е. нужна квадратная компоновка кадра т.к. аватарка квадратная или
            круглая, а из прямоугольной фотографии не всегда получается
            корректно, без отрезания рук и ног вырезать квадрат. От верхнего
            края фотографии до значимых частей изображения (головы, лица) должно
            быть около 500 пикселей. Как будет выглядеть изображение артиста на
            смартфонах можно посмотреть здесь{" "}
            <Link
              _hover={{ color: "red" }}
              _active={{ boxShadow: "none!important", color: "red" }}
              _focus={{ boxShadow: "none!important", color: "red" }}
              href="https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view"
              isExternal
            >
              https://drive.google.com/file/d/14hRrTmackLfJgJA4krhSUkheZzXbetkd/view
            </Link>{" "}
            предварительно вставив изображение артиста отдельным слоем.
            <br />
            Особо обратите внимание, чтобы брови артиста были не выше верхней
            желтой линии, а губу - не ниже нижней. Apple сейчас прогоняет все
            фото через этот шаблон и часто отказывает именно по этой причине
            <br />
            <br />
            - Изображение должно быть в цветовом пространстве RGB с разрешением
            не менее 72 точек на дюйм (dpi). Не увеличивайте масштаб
            изображения, если его размер меньше необходимого. Используйте
            изображение только в том случае, если Вы имеете право предоставить
            его в общий доступ по всему миру.
            <br />
            - фото не должно совпадать ни с одной из обложек дисков,
            <br />
            - на фото не должно быть надписей,
            <br />- на фото не должно быть рамок или полос сверху и снизу
          </Text>
        </Box>
      )}
    </Box>
  );
}
