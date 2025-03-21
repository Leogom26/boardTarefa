import { GetServerSideProps } from "next"; // Importando o tipo GetServerSideProps do Next.js
import styles from "./styles.module.css"; // Estilos CSS
import Head from "next/head"; // Importação do componente Head do Next.js

// Corrigindo a importação de getSession do NextAuth
import { getSession } from "next-auth/react"; 
import { Textarea } from "../../components/textarea"; // Componente de Textarea 
import { FiShare2 } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form>
              <Textarea placeholder="Digite qual sua tarefa..." />
              <div className={styles.checkboxArea}>
                <input type="checkbox" className={styles.checkbox} />
                <label>Deixar tarefa pública?</label>
              </div>

              <button className={styles.button} type="submit">
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas tarefas</h1>

          <article className={styles.task}>
            <div className={styles.taskContainer}>
              <label htmlFor="" className={styles.tag}>PÚBLICO</label>
              <button className={styles.shareButton}>
                <FiShare2
                  size={22}
                  color="#3183ff"
                />
              </button>
            </div>
            <div className={styles.taskContent}>
              <p>Minha primeira tarefa</p>
              <button className={styles.trashButton}>
                <FaTrash
                  size={24}
                  color="#ea3140"
                />
              </button>
            </div>
          </article>

        </section>

      </main>
    </div>
  );
}

// Função para obter a sessão do usuário do NextAuth no lado do servidor
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Obtendo a sessão do usuário
  const session = await getSession({ req });

  if (!session?.user) {
    // Se não houver usuário na sessão, redireciona para a página principal
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // Retorna as props necessárias para o componente
  };
};
