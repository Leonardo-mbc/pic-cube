import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DirectoryList } from '../components/directory-list';
import { ContentsPanel } from '../components/contents-panel';
import { DirectoriesTable, ContentsWithChildItems } from '../interfaces/db';
import styles from './index/styles.module.css';
import { PageTitle } from '../components/page-title';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { contentsState } from '../components/contents-panel/state';
import { listContents, listDirectories } from './api/db/list-contents';
import { checkTables } from './api/db/check';

interface IndexProps {
  directories: DirectoriesTable[];
  contents: ContentsWithChildItems[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (await checkTables()) {
    const [{ contents }, { directories }] = await Promise.all([listContents(), listDirectories()]);

    const props: IndexProps = {
      directories,
      contents,
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

const Index: NextPage<IndexProps> = (props) => {
  const setContents = useSetRecoilState(contentsState);

  useEffect(() => {
    setContents(props.contents);
  }, [setContents, props.contents]);

  return (
    <div className={styles.container}>
      <Head>
        <title>pic-cube</title>
      </Head>
      {props.directories.length ? (
        <>
          <PageTitle title="最近追加したもの" />
          <ContentsPanel />
        </>
      ) : (
        <div>
          <p>まずはパスを追加してみてください</p>
          <DirectoryList directories={props.directories} />
        </div>
      )}
    </div>
  );
};

export default Index;
