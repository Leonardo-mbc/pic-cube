import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DirectoryList } from '../components/directory-list';
import { ContentsPanel } from '../components/contents-panel';
import { DirectoriesTable, ContentsTableWithAliasPath } from '../interfaces/db';
import { mysql, connect } from '../utilities/mysql-connect';
import styles from './index/styles.module.css';
import { PageTitle } from '../components/page-title';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { contentsState } from '../components/contents-panel/state';

interface IndexProps {
  directories: DirectoriesTable[];
  contents: ContentsTableWithAliasPath[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (await connect()) {
    const [directoriesResult, contentsResult] = await Promise.all([
      mysql.query('SELECT * FROM directories'),
      mysql.query(
        'SELECT contents.*, directories.alias_path, thumbnails.data as thumbnail FROM contents LEFT JOIN directories ON contents.directory_id = directories.id LEFT JOIN thumbnails ON contents.id = thumbnails.content_id WHERE contents.unlink = 0 ORDER BY contents.created_at DESC;'
      ),
    ]);
    const directories = JSON.parse(JSON.stringify(directoriesResult)) as DirectoriesTable[];
    const contents = JSON.parse(JSON.stringify(contentsResult)) as ContentsTableWithAliasPath[];

    await mysql.end();

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
  }, [props.contents]);

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
