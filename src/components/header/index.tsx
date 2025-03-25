import styles from "./styles.module.css";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router"; 

export function Header() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const isAdminPage = router.pathname !== "/admin";

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

          { isAdminPage && session?.user && (
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
