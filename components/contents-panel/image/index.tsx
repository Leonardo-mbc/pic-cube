import { ContentsTableWithAliasPath } from '../../../interfaces/db';
import styles from './styles.module.css';

interface ImageProps {
  content: ContentsTableWithAliasPath;
}

export const Image: React.FC<ImageProps> = (props) => {
  return (
    <div className={styles.container}>
      <a href={`/static/${props.content.alias_path}/${props.content.path}`}>
        <img src={`/static/${props.content.alias_path}/${props.content.path}`} />
      </a>
    </div>
  );
};
