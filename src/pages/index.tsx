import Head from "next/head";
import styles from "@/styles/home.module.css";

export default function Home() {
  return (
    <>
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma fácil</title>
      </Head>
      <h1> Meu projeto </h1>
    </div>
    </>
  );
}
