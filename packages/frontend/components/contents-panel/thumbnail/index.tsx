import { useRouter } from 'next/router';
import styles from './styles.module.css';
import { MouseEvent, useState } from 'react';
import clsx from 'clsx';

interface Content {
  id: number;
  link: string;
  name: string;
  thumbnailUrl?: string;
  collection?: {
    contentIds: number[];
  };
}

interface ImageProps {
  content: Content;
  isSelected: boolean;
  isSelectable: boolean;
  selectedOrder: number;
  onSelect: (contentId: number, shiftKey: boolean) => void;
  onChangeIsSelectable: (value: boolean) => void;
}

const LONG_PRESS_DURATION = 400;

export const Thumbnail: React.FC<ImageProps> = ({
  content,
  isSelected,
  isSelectable,
  onSelect,
  onChangeIsSelectable,
  selectedOrder,
}) => {
  const router = useRouter();
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timer>();
  const [triggerLongPress, setTriggerLongPress] = useState(false);

  function checkStartLongPress(e: MouseEvent<HTMLAnchorElement>) {
    setLongPressTimer(
      setTimeout(() => {
        setTriggerLongPress(true);
        onChangeIsSelectable(true);
      }, LONG_PRESS_DURATION)
    );
  }
  function checkEndLongPress(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (triggerLongPress || isSelectable) {
      onSelect(content.id, e.shiftKey);
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
        href={content.link}
        className={clsx({
          [styles.selected]: isSelected,
          [styles.diffParent]: !!content.collection,
        })}
        onClickCapture={checkEndLongPress}
        onMouseDownCapture={checkStartLongPress}
      >
        <section className={styles.rotateBorder} />
        <picture>
          <img src={content.thumbnailUrl} alt={content.name} />
        </picture>
        <section className={styles.orderDisplay}>
          {selectedOrder}
          {content.collection && `~${selectedOrder + content.collection.contentIds.length - 1}`}
        </section>
        <div className={styles.label}>
          <span>{content.name}</span>
        </div>
      </a>
    </div>
  );
};
