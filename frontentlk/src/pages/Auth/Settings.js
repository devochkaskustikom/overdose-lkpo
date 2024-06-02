import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Container,
  Textarea,
  useToast,
  Button,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toast = useToast();

  const { register, handleSubmit } = useForm();

  const getUser = async () => {
    try {
      const data = await axios.get(`${apiUrl()}/user/profile_info`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (data.data.error) {
        toast({
          title: `Произошла ошибка!`,
          description: data.data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setUser(data.data.user);
        setLoaded(true);
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
  };
  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, []);

  const edit_profile = async (datass) => {
    setIsLoading(true);
    try {
      let datas = datass;
      if (datas.password == "") {
        delete datas.password;
      }
      const data = await axios.post(`${apiUrl()}/user/edit_profile`, datas, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });
      if (data.data.error) {
        toast({
          title: `Произошла ошибка!`,
          description: data.data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Данные сохранены`,
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
    getUser();
    setIsLoading(false);
  };

  return (
    <Container>
      <Heading size="2xl">Настройки</Heading>
      {!loaded && (
        <Center>
          <Spinner color="red" size="xl" />
        </Center>
      )}
      {user && (
        <form onSubmit={handleSubmit(edit_profile)}>
          <FormControl mt="10px" mb="10px">
            <FormLabel htmlFor="name">* Имя</FormLabel>
            <Input
              id="name"
              type="text"
              required="required"
              defaultValue={user.name}
              {...register("name")}
            />
          </FormControl>
          <FormControl mt="10px" mb="10px">
            <FormLabel htmlFor="username">* Логин</FormLabel>
            <Input
              id="username"
              type="text"
              required="required"
              defaultValue={user.username}
              {...register("username")}
            />
          </FormControl>
          <FormControl mt="10px" mb="10px">
            <FormLabel htmlFor="email">* Email</FormLabel>
            <Input
              id="email"
              type="email"
              required="required"
              defaultValue={user.email}
              {...register("email")}
            />
          </FormControl>
          <FormControl mt="10px" mb="10px">
            <FormLabel htmlFor="password">Пароль</FormLabel>
            <Input id="password" type="password" {...register("password")} />
          </FormControl>
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
        </form>
      )}
    </Container>
  );
}
