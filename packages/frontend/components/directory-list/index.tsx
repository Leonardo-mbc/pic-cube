import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { DirectoriesTable } from '../../interfaces/db';

import * as dbRequest from '../../requests/db';
import styles from './styles.module.css';

interface DirectoryListProps {
  directories: DirectoriesTable[];
}

export const DirectoryList: React.FC<DirectoryListProps> = (props) => {
  const [directories, setDirectories] = useState<DirectoriesTable[]>(props.directories);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      path: '',
    },
  });

  async function onSubmit(values: FieldValues) {
    const { path } = values as { path: string };
    try {
      const { directories } = await dbRequest.addDirectory(path);
      if (directories) {
        setDirectories(directories);
      }
    } catch (e) {
      throw Error(`[component:directory-list]: ${e}`);
    } finally {
      reset();
    }
  }

  return (
    <div className={styles.container}>
      <ul>
        {directories.map((directory, key) => (
          <li key={key}>{directory.path}</li>
        ))}
        <li>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('path')} />
            <input type="submit" value="追加する" />
          </form>
        </li>
      </ul>
    </div>
  );
};
