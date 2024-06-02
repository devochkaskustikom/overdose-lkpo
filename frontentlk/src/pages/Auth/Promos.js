import {
  Box,
  Link,
  Heading,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Button,
  useToast,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import React from "react";
import not_found from "../../assets/not_found.svg";
import { Link as RLink } from "react-router-dom";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Promos() {
  const [promos, setPromos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const getLinks = async () => {
    const data = await axios.get(`${apiUrl()}/user/get_promos`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });

    setPromos(data.data.promos);
    setLoaded(true);
  };

  useEffect(() => {
    if (!loaded) {
      getLinks();
    }
  }, []);

  return (
    <Box alignItems="center" textAlign="center">
      <Heading fontWeight="bold" size="2xl">
        Промо
      </Heading>
      <Button
        size="sm"
        mt="10px"
        color="red"
        border="1px"
        bgColor="white"
        borderColor="red"
        _hover={{ color: "white", bgColor: "red" }}
        _focus={{ boxShadow: "none!important", color: "white", bgColor: "red" }}
        _active={{
          boxShadow: "none!important",
          color: "white",
          bgColor: "red",
        }}
        as={RLink}
        to="/promo/new"
      >
        Отправить промо
      </Button>
      <Container maxW="container.xl" alignContent="center" alignItems="center">
        <TableContainer mt="20px">
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Название</Th>
                <Th>Артист</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {promos.map((promo) => {
                return (
                  <Tr>
                    <Th>
                      <Image
                        borderWidth="1px"
                        borderRadius="lg"
                        src={`https://img.gs/lprfwxwbrz/100x100/${apiUrl()}${
                          promo.release.cover
                        }`}
                        fallbackSrc={not_found}
                        w="50px"
                        h="50px"
                      />
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/promo/${promo.id}`}
                      >
                        {promo.release.title || "Н/А"}
                      </Link>
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/promo/${promo.id}`}
                      >
                        {promo.release.artists || "Н/А"}
                      </Link>
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/promo/${promo.id}`}
                      >
                        <i className="bi bi-eye" /> Подробнее
                      </Link>
                      {promo.payed === 0 && (
                        <Box>
                          <Link
                            _hover={{ color: "red" }}
                            _active={{
                              boxShadow: "none!important",
                              color: "red",
                            }}
                            _focus={{
                              boxShadow: "none!important",
                              color: "red",
                            }}
                            as={RLink}
                            to={`/promo/edit/${promo.id}`}
                          >
                            <i className="bi bi-pencil"></i> Редактировать
                          </Link>
                        </Box>
                      )}
                    </Th>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
        {!loaded && (
          <Center mt="20px">
            <Spinner color="red" size="xl" />
          </Center>
        )}
      </Container>
    </Box>
  );
}
