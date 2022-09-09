import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { DBConfig } from '../../interfaces/db';
import * as dbRequest from '../../requests/db';
import * as scannerRequest from '../../requests/scanner';
import * as DB from '../../constants/db';
import styles from './styles.module.css';

interface InstallProps extends DBConfig {}

export const getServerSideProps: GetServerSideProps = async () => {
  const props: InstallProps = {
    dbHost: process.env.DB_HOST || '',
    dbUser: process.env.DB_USER || '',
    dbPass: process.env.DB_PASS || '',
    dbName: process.env.DB_NAME || '',
  };
  return {
    props,
  };
};

const Install: NextPage<InstallProps> = (props) => {
  const router = useRouter();
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const { register, handleSubmit } = useForm({
    defaultValues: {
      dbHost: props.dbHost,
      dbUser: props.dbUser,
      dbPass: props.dbPass,
      dbName: props.dbName,
    },
  });

  async function onSubmit(values: FieldValues) {
    setSubmitContext(true, 'データベースを確認しています...');
    const config = values as DBConfig;

    try {
      const { tables } = await dbRequest.check(config);
      const missingTables = DB.TABLES.filter((tableName) => !tables.includes(tableName));

      try {
        const { message } = await dbRequest.create(missingTables);
        setSubmitContext(false, message);

        await scannerRequest.stop();

        setTimeout(async () => {
          // scannerRequest.stop と実行タイミングをずらすために setTimeout 内に設置
          await scannerRequest.check();
          router.replace('/');
        }, 2000);
      } catch (e) {
        throw Error(`[page:install_create]: ${e}`);
      }
    } catch (e) {
      throw Error(`[page:install_check]: ${e}`);
    }
  }

  function setSubmitContext(isDisabled: boolean, message?: string) {
    setIsSubmitDisabled(isDisabled);
    setSubmitMessage(message || '');
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>pic-cube のインストール</title>
      </Head>
      <div className={styles.description}>まずは mysql と接続します</div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <fieldset className={styles.formContainer}>
          <legend>MySQL設定</legend>
          <div>
            <p>
              <label>サーバー</label>
              <input {...register('dbHost')} />
            </p>
            <p>
              <label>ユーザー名</label>
              <input {...register('dbUser')} />
            </p>
            <p>
              <label>パスワード</label>
              <input type="password" {...register('dbPass')} autoComplete="new-password" />
            </p>
            <p>
              <label>データベース名</label>
              <input {...register('dbName')} />
            </p>
          </div>
          <div className={styles.submitArea}>
            <input value="設定を反映する" type="submit" disabled={isSubmitDisabled} />
            {submitMessage && <span className={styles.submitMessage}>{submitMessage}</span>}
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Install;
