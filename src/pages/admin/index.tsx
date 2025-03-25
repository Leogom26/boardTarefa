import { GetServerSideProps } from "next";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import styles from "./styles.module.css";
import Head from "next/head";

import { getSession } from "next-auth/react";
import { Textarea } from "../../components/textarea";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

import { db } from "../../services/firebaseConnection";

import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";

// Importando a formatação da data
import { format } from "date-fns";
import { ptBR } from "date-fns/locale"; // Se você deseja a data em português.

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Admin({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(tarefasRef, orderBy("created", "desc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let lista: TaskProps[] = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created.toDate(), // Convertendo o timestamp para Date
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(lista);
      });

      return () => unsubscribe();
    }

    loadTarefas();
  }, []);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert("URL Copiada com sucesso!");
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id);
    try {
      await deleteDoc(docRef);
      alert("Tarefa deletada com sucesso!");
    } catch (err) {
      console.log("Erro ao deletar tarefa:", err);
      alert("Erro ao deletar tarefa.");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(event.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
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

          {tasks.length === 0 ? (
            <p>Você ainda não tem tarefas registradas.</p>
          ) : (
            tasks.map((item) => (
              <article key={item.id} className={styles.task}>
                {item.public && (
                  <div className={styles.tagContainer}>
                    <label className={styles.tag}>PÚBLICO</label>
                    <button
                      className={styles.shareButton}
                      onClick={() => handleShare(item.id)}
                    >
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                  </div>
                )}

                <div className={styles.taskContent}>
                  {item.public ? (
                    <Link href={`/task/${item.id}`}>
                      <p>{item.tarefa}</p>
                    </Link>
                  ) : (
                    <p>{item.tarefa}</p>
                  )}

                  <button
                    className={styles.trashButton}
                    onClick={() => handleDeleteTask(item.id)}
                  >
                    <FaTrash size={24} color="#ea3140" />
                  </button>
                </div>

                {/* Exibindo o nome do usuário e a data de criação */}
                <div className={styles.taskFooter}>
                  <span className={styles.createdAt}>
                    Criado por: <strong>{item.user}</strong> em {format(item.created, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

// getServerSideProps para autenticação do usuário
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  // Verifica se o usuário está autenticado e se o e-mail é o correto
  if (!session?.user || 
    (session.user.email !== "leogomdesenvolvimento@gmail.com" && session.user.email !== "azulcargov@gmail.com" && session.user.email !== "leogomecommerce@gmail.com")) {
    // Redireciona para a página de erro ou outra página caso o usuário não tenha permissão
    return {
      redirect: {
        destination: "/", // Rota de erro ou outra página desejada
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
