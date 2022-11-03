import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Introduction from "./components/Introduction/Introduction";
import Navbar from "./components/Navbar/Navbar";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Rent Web3</title>
        <link rel="shortcut icon" href="./rw3.png" />
      </Head>
      <Introduction />
    </div>
  );
}
