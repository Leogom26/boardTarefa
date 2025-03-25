import styles from "./styles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router"; 

export function Header() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const isOnAdminPage = router.pathname === "/admin"; // Corrigir: verificar se a página é "/admin"

  // Lista de e-mails permitidos para acesso à página admin
  const allowedAdminEmails = [
    "leogomdesenvolvimento@gmail.com",
    "azulcargov@gmail.com",
    "leogomecommerce@gmail.com"
  ];

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Leo App
            </h1>
          </Link>
          {session?.user && (
            <Link href="/dashboard" className={styles.link}>
              Painel
            </Link>
          )}

          {/* Verificar se o usuário está na lista de e-mails permitidos para exibir o link "Admin" */}
          {!isOnAdminPage && session?.user && allowedAdminEmails.includes(session?.user.email) && (
            <Link href="/admin" className={styles.link}>
              Admin
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
