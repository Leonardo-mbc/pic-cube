import { ContentsTableWithAliasPath } from '../../../interfaces/db';
import styles from './styles.module.css';

interface ImageProps {
  content: ContentsTableWithAliasPath;
}

export const Thumbnail: React.FC<ImageProps> = (props) => {
  const link = `/static/${props.content.alias_path}/${props.content.path}/${props.content.filename}`;
  const base64String = Buffer.from(props.content.thumbnail.data).toString('base64');
  const thumbData = `data:image/jpeg;base64,${base64String}`;

  return (
    <div className={styles.container}>
      <a href={link}>
        <img src={thumbData} />
        <div className={styles.label}>
          <span>{props.content.filename}</span>
        </div>
      </a>
    </div>
  );
};
