import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DBConfig, DirectoriesTable } from '../../interfaces/db';
import styles from './styles.module.css';
import { connect, mysql } from '../../utilities/mysql-connect';
import { DirectoryList } from '../../components/directory-list';

interface ConfigurationProps {
  dbConfig: DBConfig;
  directories: DirectoriesTable[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const dbConfig = {
    dbHost: process.env.DB_HOST || '',
    dbUser: process.env.DB_USER || '',
    dbPass: process.env.DB_PASS || '',
    dbName: process.env.DB_NAME || '',
  };

  if (await connect()) {
    const directories = JSON.parse(
      JSON.stringify((await mysql.query('SELECT * FROM `directories`')) as DirectoriesTable[])
    );

    await mysql.end();

    const props: ConfigurationProps = {
      dbConfig,
      directories,
    };
    return {
      props,
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/install',
      },
    };
  }
};

const Configuration: NextPage<ConfigurationProps> = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>pic-cube 設定</title>
      </Head>
      <DirectoryList directories={props.directories} />
    </div>
  );
};

export default Configuration;
