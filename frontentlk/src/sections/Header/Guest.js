import React from "react";
import {
  Link,
  Box,
  Flex,
  Text,
  Stack,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";

const Header = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const close = () => setIsOpen(false);

  return (
    <NavBarContainer
      {...props}
      borderBottom="1px"
      borderBottomColor="#d1d5db"
      backgroundColor="white!important"
      style={{ zIndex: 100 }}
    >
      <Logo
        marginLeft={["0px", "20px"]}
        color={["black"]}
        onClick={close}
        w="170px"
      />
      <MenuToggle />
      <MenuLinks isOpen={isOpen} close={close} />
    </NavBarContainer>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Закрыть</title>
    <path
      fill="black"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="black"
  >
    <title>Меню</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box display={{ base: "block", md: "none" }}>
      <Box onClick={onOpen}>
        <MenuIcon />
      </Box>
      <Drawer placement="left" size="full" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <Logo
              marginLeft={["0px", "20px"]}
              color={["black"]}
              onClick={onClose}
              w="170px"
            />
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing={2} pt={[4, 4, 0, 0]}>
              <MenuItem to="/register" onClick={onClose} isLast>
                <Button
                  w="100%"
                  color="red"
                  border="1px"
                  bgColor="white"
                  borderColor="red"
                  _hover={{ color: "white", bgColor: "red" }}
                  _focus={{
                    boxShadow: "none!important",
                    bgColor: "white",
                    borderColor: "red",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    bgColor: "white",
                    borderColor: "red",
                  }}
                >
                  Зарегистрироваться
                </Button>
              </MenuItem>
              <MenuItem to="/login" onClick={onClose} isLast>
                <Button
                  w="100%"
                  color="white"
                  border="1px"
                  bgColor="red"
                  borderColor="red"
                  _hover={{
                    color: "white",
                    bgColor: "#e00404",
                    borderColor: "#e00404",
                  }}
                  _focus={{
                    boxShadow: "none!important",
                    bgColor: "red",
                    borderColor: "white",
                  }}
                  _active={{
                    boxShadow: "none!important",
                    bgColor: "red",
                    borderColor: "white",
                  }}
                >
                  Войти
                </Button>
              </MenuItem>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

const MenuItem = ({ children, isLast, isCount, to = "/", close, ...rest }) => {
  return (
    <Link
      _hover={{ color: "red" }}
      _active={{ boxShadow: "none!important", color: "red" }}
      _focus={{ boxShadow: "none!important", color: "red" }}
      onClick={close}
      as={RLink}
      to={to}
    >
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen, toggle, close }) => {
  const [count, setCount] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const api_url = apiUrl();
  useEffect(() => {
    const loading = async () => {
      const data = await axios.get(`${api_url}/releases_count`);

      setCount(data.data.count);
      setLoaded(true);
    };
    if (!loaded) {
      loading();
    }
  }, []);
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
      color="black"
      marginRight={["0px", "20px"]}
    >
      <Stack
        spacing={4}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <Text>
          <Text display="block">{count} релизов загружено</Text>
        </Text>
        <MenuItem to="/register" onClick={close} isLast>
          <Button
            color="red"
            border="1px"
            bgColor="white"
            borderColor="red"
            _hover={{ color: "white", bgColor: "red" }}
            _focus={{
              boxShadow: "none!important",
              bgColor: "white",
              borderColor: "red",
            }}
            _active={{
              boxShadow: "none!important",
              bgColor: "white",
              borderColor: "red",
            }}
          >
            Зарегистрироваться
          </Button>
        </MenuItem>
        <MenuItem to="/login" onClick={close} isLast>
          <Button
            color="white"
            border="1px"
            bgColor="red"
            borderColor="red"
            _hover={{
              color: "white",
              bgColor: "#e00404",
              borderColor: "#e00404",
            }}
            _focus={{
              boxShadow: "none!important",
              bgColor: "red",
              borderColor: "white",
            }}
            _active={{
              boxShadow: "none!important",
              bgColor: "red",
              borderColor: "white",
            }}
          >
            Войти
          </Button>
        </MenuItem>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      mb={8}
      p={8}
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["black"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default Header;
