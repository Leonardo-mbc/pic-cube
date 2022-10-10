import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { isSelectableState } from '../state';
import { ContentsWithChildItems } from '../../../interfaces/db';
import styles from './styles.module.css';
import { MouseEvent, useState } from 'react';
import clsx from 'clsx';

interface ImageProps {
  content: ContentsWithChildItems;
  isSelected: boolean;
  selectedOrder: number;
  onSelect: (content: ContentsWithChildItems, shiftKey: boolean) => void;
}

const LONG_PRESS_DURATION = 400;

export const Thumbnail: React.FC<ImageProps> = ({
  content,
  isSelected,
  onSelect,
  selectedOrder,
}) => {
  const router = useRouter();
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
    e.preventDefault();
    if (triggerLongPress || isSelectable) {
      onSelect(content, e.shiftKey);
    }

    setTriggerLongPress(false);

    if (!isSelectable) {
      clearTimeout(longPressTimer);
      router.push(`?display=${content.id}`, undefined, { shallow: true });
    }
  }

  return (
    <div className={clsx(styles.container)}>
      <a
        href={link}
        className={clsx({
          [styles.selected]: isSelected,
          [styles.diffParent]: content.collection_id,
        })}
        onClickCapture={checkEndLongPress}
        onMouseDownCapture={checkStartLongPress}>
        <section className={styles.rotateBorder} />
        <img src={thumbData} />
        <section className={styles.orderDisplay}>
          {selectedOrder}
          {content.collection_id && `~${selectedOrder + content.contents.length - 1}`}
        </section>
        <div className={styles.label}>
          <span>{content.filename}</span>
        </div>
      </a>
    </div>
  );
};
