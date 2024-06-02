import React from "react";
import { Box, Link, Text, Image } from "@chakra-ui/react";
import { Link as RLink } from 'react-router-dom';
import full_logo from '../../assets/full_logo.svg'

export default function Logo(props) {
  return (
    <Box {...props}>
      <Link textDecoration='none' _hover={{'text-decoration': 'none'}} _focus={{ boxShadow: 'none!important' }} as={RLink} to={props.to || '/'}>
        <Image draggable={false} src={full_logo} w='150px' />
      </Link>
    </Box>
  );
}