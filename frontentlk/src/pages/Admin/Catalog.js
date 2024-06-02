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
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import React from "react";
import not_found from "../../assets/not_found.svg";
import { Link as RLink } from "react-router-dom";

export default function Catalog(props) {
  const [releases, setReleases] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [last, setLast] = useState(null);

  const getReleases = async () => {
    const data = await axios.get(`${apiUrl()}/admin/${props.method}`, {
      headers: {
        authorization: `Bearer ${getToken()}`,
      },
    });

    setReleases(data.data.releases);
    setLoaded(true);
  };

  useEffect(() => {
    if (last !== props.name) {
      setReleases([]);
      setLoaded(false);
      setLast(props.name);
      getReleases();
    }
  });

  return (
    <Box alignItems="center" textAlign="center">
      <Heading fontWeight="bold" size="2xl">
        {props.name}
      </Heading>
      <Container maxW="container.xl" alignContent="center" alignItems="center">
        <TableContainer mt="20px">
          <Table>
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Тип</Th>
                <Th>Название</Th>
                <Th>Версия</Th>
                <Th>Артист</Th>
                <Th>UPC</Th>
                <Th>Статус</Th>
              </Tr>
            </Thead>
            <Tbody>
              {releases.map((release) => {
                return (
                  <Tr>
                    <Th>
                      <Image
                        borderWidth="1px"
                        borderRadius="lg"
                        src={`https://img.gs/lprfwxwbrz/100x100/${apiUrl()}${
                          release.cover
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
                        to={`/admin/view/${release.id}`}
                      >
                        {release.type || "Н/А"}
                      </Link>
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/admin/view/${release.id}`}
                      >
                        {release.title || "Н/А"}
                      </Link>
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/admin/view/${release.id}`}
                      >
                        {release.version || "Н/А"}
                      </Link>
                    </Th>
                    <Th>
                      <Link
                        _hover={{ color: "red" }}
                        _active={{ boxShadow: "none!important", color: "red" }}
                        _focus={{ boxShadow: "none!important", color: "red" }}
                        as={RLink}
                        to={`/admin/view/${release.id}`}
                      >
                        {release.artists || "Н/А"}
                      </Link>
                    </Th>
                    <Th>{release.upc || "Н/А"}</Th>
                    <Th>
                      {(release.status === "ok" && <Box>На площадках</Box>) ||
                        (release.status === "moderation" && (
                          <Box>На модерации</Box>
                        ))}
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
