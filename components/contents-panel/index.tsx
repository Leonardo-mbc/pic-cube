import { ContentsTableWithAliasPath } from '../../interfaces/db';
import { Image } from './image';
import styles from './styles.module.css';

interface ContentsPanelProps {
  contents: ContentsTableWithAliasPath[];
}

export const ContentsPanel: React.FC<ContentsPanelProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {props.contents.map((content, key) => (
          <Image key={key} content={content} />
        ))}
      </div>
    </div>
  );
};
