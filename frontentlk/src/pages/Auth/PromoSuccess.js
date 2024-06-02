import {
  Box,
  Heading,
  Container,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import { useParams } from "react-router-dom";

export default function Success() {
  let params = useParams();
  const [loaded, setLoaded] = useState(false);
  const [pay, setPay] = useState(false);
  const toast = useToast();
  const success = async () => {
    try {
      const { data: data } = await axios.get(
        `${apiUrl()}/user/promo_success?id=${params.id}`,
        {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (data.error) {
        setPay(false);
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
  };

  useEffect(() => {
    if (!loaded) {
      success();
    }
  }, []);
  return (
    <Container>
      {!loaded && <Spinner size="xl" color="red" />}
      <Box>
        {loaded && (
          <Box>
            {(pay && (
              <Box>
                <Heading>Спасибо за оплату!</Heading>
                <Text>Промо было отправлено.</Text>
              </Box>
            )) || <Heading>Оплата не найдена.</Heading>}
          </Box>
        )}
      </Box>
    </Container>
  );
}
