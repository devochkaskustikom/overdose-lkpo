import React from "react";
import {
  Link,
  Box,
  Flex,
  Text,
  Stack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem as MI,
} from "@chakra-ui/react";
import { Link as RLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from "../../config/apiUrl";
import getToken from "../../config/getToken";
import Cookies from "js-cookie";

const Header = (props) => {
  const [isOpen, setIsOpen] = useState(false);

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
      <MenuToggle toggle={toggle} isOpen={isOpen} />
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

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({
  children,
  isLast,
  isCount,
  to = "/",
  close,
  isPage,
  ...rest
}) => {
  let color = "";
  if (isPage) color = "red";
  return (
    <Link
      color={color}
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

const MenuLinks = ({ isOpen, close }) => {
  const [name, setName] = useState(null);
  const [status, setStatus] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [logout, setLogout] = useState(false);

  const exit = () => {
    Cookies.set("auth-token", "");
    setLogout(true);
  };
  let location = useLocation();
  let url = location.pathname;
  const api_url = apiUrl();
  useEffect(() => {
    const loading = async () => {
      const data = await axios.get(`${api_url}/user/profile_info`, {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      });

      if (data.data.error === 401) {
        exit();
      }

      setName(data.data.user.name);
      setStatus(data.data.user.status);
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
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        {(url === "/" && (
          <MenuItem to="/" close={close} isPage>
            <i className="bi bi-clipboard-data"></i> Главная
          </MenuItem>
        )) || (
          <MenuItem to="/" close={close}>
            <i className="bi bi-clipboard-data"></i> Главная
          </MenuItem>
        )}
        {(url === "/news" && (
          <MenuItem to="/news" close={close} isPage>
            <i className="bi bi-newspaper"></i> Новости
          </MenuItem>
        )) || (
          <MenuItem to="/news" close={close}>
            <i className="bi bi-newspaper"></i> Новости
          </MenuItem>
        )}
        {(url === "/new_release" && (
          <MenuItem to="/new_release" close={close} isPage>
            <i className="bi bi-plus-lg"></i> Новый релиз
          </MenuItem>
        )) || (
          <MenuItem to="/new_release" close={close}>
            <i className="bi bi-plus-lg"></i> Новый релиз
          </MenuItem>
        )}
        {(url === "/catalog" && (
          <MenuItem to="/catalog" close={close} isPage>
            <i className="bi bi-music-note-list"></i> Каталог
          </MenuItem>
        )) || (
          <MenuItem to="/catalog" close={close}>
            <i className="bi bi-music-note-list"></i> Каталог
          </MenuItem>
        )}
        {(url === "/links" && (
          <MenuItem to="/links" close={close} isPage>
            <i className="bi bi-globe"></i> Промо ссылки
          </MenuItem>
        )) || (
          <MenuItem to="/links" close={close}>
            <i className="bi bi-globe"></i> Промо ссылки
          </MenuItem>
        )}
        {(url === "/finance" && (
          <MenuItem to="/finance" close={close} isPage>
            <i className="bi bi-currency-dollar"></i> Финансы
          </MenuItem>
        )) || (
          <MenuItem to="/finance" close={close}>
            <i className="bi bi-currency-dollar"></i> Финансы
          </MenuItem>
        )}
        <Menu>
          <MenuButton
            as={Button}
            color="red"
            border="1px"
            bgColor="white"
            borderColor="red"
            _hover={{ color: "white", bgColor: "red" }}
            _focus={{
              boxShadow: "none!important",
              color: "red",
              bgColor: "white",
            }}
            _active={{
              boxShadow: "none!important",
              color: "white",
              bgColor: "red",
            }}
            leftIcon={<i className="bi bi-person-circle"></i>}
          >
            {name}
          </MenuButton>
          <MenuList>
            {status === "admin" && (
              <MI onClick={close} as={RLink} to="/admin">
                Админ панель
              </MI>
            )}
            <MI onClick={close} as={RLink} to="/help">
              Помощь
            </MI>
            <MI onClick={close} as={RLink} to="/terms/terms">
              Соглашение
            </MI>
            <MI onClick={close} as={RLink} to="/settings">
              Настройки
            </MI>
            <MI onClick={exit}>Выйти</MI>
          </MenuList>
        </Menu>
      </Stack>
      {logout && (window.location.href = "")}
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