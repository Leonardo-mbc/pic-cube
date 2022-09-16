import clsx from 'clsx';
import { ContentsTableWithAliasPath } from '../../interfaces/db';
import { Thumbnail } from './thumbnail';
import styles from './styles.module.css';
import { useState } from 'react';

interface ContentsPanelProps {
  contents: ContentsTableWithAliasPath[];
}

export const ContentsPanel: React.FC<ContentsPanelProps> = (props) => {
  const THUMB_SIZES = ['small', 'medium', 'large'] as const;
  const [thumbSizeIndex, setThumbSizeIndex] = useState<number>(1);

  function rotateThumbSize() {
    const index = thumbSizeIndex + 1;
    setThumbSizeIndex(THUMB_SIZES.length <= index ? 0 : index);
  }

  return (
    <>
      <div className={styles.toolsContainer}>
        <div className={styles.toolsParts} onClick={rotateThumbSize}>
          サムネイルサイズ：<span className={styles.thumbSize}>{THUMB_SIZES[thumbSizeIndex]}</span>
        </div>
      </div>
      <div
        className={clsx(
          styles.container,
          { [styles.thumbSmall]: THUMB_SIZES[thumbSizeIndex] === 'small' },
          { [styles.thumbLarge]: THUMB_SIZES[thumbSizeIndex] === 'large' }
        )}>
        {props.contents.map((content, key) => (
          <Thumbnail key={key} content={content} />
        ))}
      </div>
    </>
  );
};
