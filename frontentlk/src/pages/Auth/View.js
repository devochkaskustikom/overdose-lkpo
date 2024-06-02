import { useState, useEffect, lazy, Suspense } from "react";
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Image,
  Container,
  RadioGroup,
  HStack,
  Radio,
  Textarea,
  Spinner,
  Center,
} from "@chakra-ui/react";
import not_found from "../../assets/not_found.svg";
import { useParams, Navigate } from "react-router-dom";

const Track = lazy(() => import("../../sections/Track"));

export default function View() {
  let params = useParams();

  const [release, setRelease] = useState();
  const [tracks, setTracks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getRelease = async () => {
    const data = await axios.get(
      `${apiUrl()}/user/get_release_info?id=${params.id}`,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    );
    if (data.data.error) {
      setNotFound(true);
    } else {
      setRelease(data.data.release);
      setTracks(data.data.tracks);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) {
      getRelease();
    }
  }, []);

  return (
    <Box m="40px">
      {notFound && <Navigate to="/404" />}
      <Heading>Информация о релизе</Heading>
      {!loaded && (
        <Center>
          <Spinner color="red" size="xl" />
        </Center>
      )}
      {loaded && (
        <Box>
          <SimpleGrid mt="10px" columns={[1, 2]} spacing="10px">
            <Box borderWidth="1px" borderRadius="lg" bgColor="white">
              <Box m="40px">
                <Heading>Обложка</Heading>
                <Image
                  mt="10px"
                  mb="10px"
                  src={`${apiUrl()}${release.cover}`}
                  fallbackSrc={not_found}
                  w="300px"
                  h="300px"
                  borderWidth="2px"
                  borderRadius="lg"
                />
              </Box>
            </Box>
            <Box borderWidth="1px" borderRadius="lg" bgColor="white">
              <Box m="40px">
                <Heading>Основная информация</Heading>
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
                <FormControl mt="10px">
                  <FormLabel htmlFor="version">Версия</FormLabel>
                  <Input
                    id="version"
                    defaultValue={release.version}
                    type="text"
                    isReadOnly
                  />
                </FormControl>
                <FormControl mt="10px" mb="10px">
                  <FormLabel htmlFor="artists">Артисты</FormLabel>
                  <Input
                    id="artists"
                    defaultValue={release.artists}
                    type="text"
                    isReadOnly
                  />
                </FormControl>
                <FormControl as="type">
                  <FormLabel as="type">Тип релиза</FormLabel>
                  <RadioGroup defaultValue={release.type}>
                    <HStack spacing="24px">
                      <Radio value="Single" isReadOnly>
                        Single
                      </Radio>
                      <Radio value="EP" isReadOnly>
                        EP
                      </Radio>
                      <Radio value="Album" isReadOnly>
                        Album
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                <FormControl mt="10px">
                  <FormLabel htmlFor="genre">Жанр</FormLabel>
                  <Input
                    id="genre"
                    defaultValue={release.genre}
                    type="text"
                    isReadOnly
                  />
                </FormControl>
                <FormControl mt="10px">
                  <FormLabel htmlFor="date">Дата релиза</FormLabel>
                  <Input
                    id="date"
                    defaultValue={release.date}
                    placeholder="Выберите дату релиза"
                    type="date"
                    isReadOnly
                  />
                </FormControl>
                <FormControl mt="10px">
                  <FormLabel htmlFor="comment">
                    Комментарий модератору
                  </FormLabel>
                  <Textarea
                    id="comment"
                    defaultValue={release.comment}
                    placeholder="Комментарий модератору"
                    type="text"
                    isReadOnly
                  />
                </FormControl>
              </Box>
            </Box>
          </SimpleGrid>
          <Box mt="10px" borderWidth="1px" borderRadius="lg" bgColor="white">
            <Box m="40px">
              <Heading>Треки</Heading>
              <Container
                maxW="container.xl"
                alignContent="center"
                alignItems="center"
              >
                <TableContainer mt="20px">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th>Название</Th>
                        <Th>Версия</Th>
                        <Th>Артист</Th>
                        <Th>Автор</Th>
                        <Th>Композитор</Th>
                        <Th>Explicit</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tracks.map((track) => {
                        return (
                          <Suspense
                            fallback={
                              <Center mt="20px">
                                <Spinner color="red" size="xl" />
                              </Center>
                            }
                          >
                            <Track track={track} />
                          </Suspense>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Container>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
