import Head from 'next/head';
import styles from './styles.module.css';

interface PageTitleProps {
  title: string;
  isReplaceTitleTag?: boolean;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, isReplaceTitleTag }) => {
  return (
    <>
      {isReplaceTitleTag && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <div className={styles.title}>
        <h2>{title}</h2>
      </div>
    </>
  );
};
