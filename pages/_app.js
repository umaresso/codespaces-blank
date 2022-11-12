import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Navbar from "./components/Navbar/Navbar";
import Head from "next/head";
import { store } from '../store'
import { Provider } from 'react-redux'
function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
    <ChakraProvider>
      <Head>
        <link rel="shortcut icon" href="./rw3.png" />
      </Head>

      <Navbar />
      <Component {...pageProps} />
    </ChakraProvider>

    </Provider>

);
}

export default MyApp;
