import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import AllRoutes from './AllRoutes';
import ScrollToTop from './components/ScrollToTop';
import theme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChakraProvider theme={theme}>
      <ScrollToTop />
      <AllRoutes />
    </ChakraProvider>
  </BrowserRouter>
);