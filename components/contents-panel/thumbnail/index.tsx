import { useRecoilState } from 'recoil';
import { isSelectableState } from '../state';
import { ContentsTableWithAliasPath } from '../../../interfaces/db';
import styles from './styles.module.css';
import { MouseEvent, useState } from 'react';
import clsx from 'clsx';

interface ImageProps {
  content: ContentsTableWithAliasPath;
  isSelected: boolean;
  selectedOrder: number;
  onSelect: (content: ContentsTableWithAliasPath, shiftKey: boolean) => void;
}

const LONG_PRESS_DURATION = 400;

export const Thumbnail: React.FC<ImageProps> = ({
  content,
  isSelected,
  onSelect,
  selectedOrder,
}) => {
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timer>();
  const [triggerLongPress, setTriggerLongPress] = useState(false);
  const [isSelectable, setIsSelectable] = useRecoilState(isSelectableState);

  const link = `/static/${content.alias_path}/${content.path}/${content.filename}`;
  const base64String = Buffer.from(content.thumbnail.data).toString('base64');
  const thumbData = `data:image/jpeg;base64,${base64String}`;

  function checkStartLongPress(e: MouseEvent<HTMLAnchorElement>) {
    setLongPressTimer(
      setTimeout(() => {
        setTriggerLongPress(true);
        setIsSelectable(true);
      }, LONG_PRESS_DURATION)
    );
  }
  function checkEndLongPress(e: MouseEvent<HTMLAnchorElement>) {
    if (triggerLongPress || isSelectable) {
      e.preventDefault();
      onSelect(content, e.shiftKey);
    }
    clearTimeout(longPressTimer);
    setTriggerLongPress(false);
  }

  return (
    <div className={clsx(styles.container)}>
      <a
        href={link}
        className={clsx({ [styles.selected]: isSelected })}
        onClickCapture={checkEndLongPress}
        onMouseDownCapture={checkStartLongPress}>
        <section className={styles.rotateBorder} />
        <img src={thumbData} />
        <section className={styles.orderDisplay}>{selectedOrder}</section>
        <div className={styles.label}>
          <span>{content.filename}</span>
        </div>
      </a>
    </div>
  );
};
