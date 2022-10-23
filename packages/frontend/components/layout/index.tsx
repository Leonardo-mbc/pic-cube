import { ReactNode } from 'react';
import LeftPane from './left-pane';
import styles from './styles.module.css';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      <LeftPane />
      <main>{children}</main>
    </div>
  );
}
