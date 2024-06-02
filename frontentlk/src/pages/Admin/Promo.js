import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import {
  Box,
  Heading,
  Container,
  Spinner,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

const Photo = lazy(() => import("../../sections/Promo/Photo"));
const Main = lazy(() => import("../../sections/Promo/Main"));

export default function Edit() {
  let params = useParams();

  const [promo, setPromo] = useState();
  const [release, setRelease] = useState();
  const [loaded, setLoaded] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const getpromo = async () => {
    const data = await axios.get(
      `${apiUrl()}/admin/get_promo?id=${params.id}`,
      {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      }
    );
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <Photo isView isAdmin id={promo.id} />
                </Suspense>
              </TabPanel>
              <TabPanel>
                <Suspense fallback={<Loader />}>
                  <Main isView isAdmin id={promo.id} />
                </Suspense>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      )}
    </Box>
  );
}
