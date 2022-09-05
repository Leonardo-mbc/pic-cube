import { ContentsTableWithAliasPath } from '../../../interfaces/db';
import styles from './styles.module.css';

interface ImageProps {
  content: ContentsTableWithAliasPath;
}

export const Thumbnail: React.FC<ImageProps> = (props) => {
  const base64String = Buffer.from(props.content.thumbnail.data).toString('base64');
  const thumbData = `data:image/jpeg;base64,${base64String}`;

  return (
    <div className={styles.container}>
      <a href={`/static/${props.content.alias_path}/${props.content.path}`}>
        <img src={thumbData} />
      </a>
    </div>
  );
};
