import clsx from 'clsx';
import { useState } from 'react';
import { HiCursorClick } from 'react-icons/hi';
import { ImImage } from 'react-icons/im';
import { MdCancel } from 'react-icons/md';
import { IoIosBrowsers } from 'react-icons/io';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { Thumbnail } from './thumbnail';
import { ToolParts } from './toolparts';
import { ToolPartsSet } from './toolparts-set';
import styles from './styles.module.css';

export interface Content {
  id: number;
  link: string;
  name: string;
  thumbnailUrl?: string;
  collection?: {
    contentIds: number[];
  };
}

interface ContentsPanelProps {
  contents: Content[];
  onBundleContents: (selectedContentIds: number[]) => Promise<void>;
  onUnlinkContents: (selectedContentIds: number[]) => Promise<void>;
}

export const ContentsPanel: React.FC<ContentsPanelProps> = ({
  contents,
  onBundleContents,
  onUnlinkContents,
}) => {
  const THUMB_SIZES = ['small', 'medium', 'large'] as const;
  const [thumbSizeIndex, setThumbSizeIndex] = useState<number>(1);
  const [isSelectable, setIsSelectable] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  function rotateThumbSize() {
    const index = thumbSizeIndex + 1;
    setThumbSizeIndex(THUMB_SIZES.length <= index ? 0 : index);
  }

  function toggleSelectable() {
    if (isSelectable) {
      setSelectedContentIds([]);
    }
    setIsSelectable(!isSelectable);
    setLastSelectedIndex(null);
  }

  function onSelect(contentId: number, selectedIndex: number, shiftKey: boolean) {
    if (!isSelectable) {
      return;
    }

    const content = contents.find((content) => content.id === contentId);
    if (!content) {
      throw new Error('content is not found');
    }

    const newSelectedContentIds = [...selectedContentIds];

    function toggleSelect(contentId: number) {
      const thumbIndex = newSelectedContentIds.indexOf(contentId);
      if (0 <= thumbIndex) {
        newSelectedContentIds.splice(thumbIndex, 1);
      } else {
        newSelectedContentIds.push(contentId);
      }
    }
    function toggleSelectContents(contentIds: number[] | undefined) {
      if (!contentIds) {
        return;
      }
      for (const id of contentIds) {
        toggleSelect(id);
      }
    }

    if (shiftKey && lastSelectedIndex !== null) {
      const diff = selectedIndex - lastSelectedIndex;
      if (diff === 0) {
        toggleSelect(content.id);
        toggleSelectContents(content.collection?.contentIds);
      } else {
        const direction = Math.sign(diff);
        for (let i = lastSelectedIndex; i !== selectedIndex; i += direction) {
          const index = i + direction;
          const contentInMultipleSelected = contents[index];
          toggleSelect(contentInMultipleSelected.id);
          toggleSelectContents(contentInMultipleSelected.collection?.contentIds);
        }
      }
    } else {
      toggleSelect(content.id);
      toggleSelectContents(content.collection?.contentIds);
    }

    setSelectedContentIds(newSelectedContentIds);
    setLastSelectedIndex(selectedIndex);
  }

  async function handleUnlink() {
    await onUnlinkContents(selectedContentIds);
    toggleSelectable();
  }

  async function handleBundleContents() {
    await onBundleContents(selectedContentIds);
    toggleSelectable();
  }

  return (
    <>
      <div className={styles.toolsContainer}>
        <ToolPartsSet
          isOpen={isSelectable}
          button={
            <ToolParts icon={isSelectable ? MdCancel : HiCursorClick} onClick={toggleSelectable}>
              {isSelectable ? '選択キャンセル' : '選択する'}
            </ToolParts>
          }
        >
          <ToolParts
            icon={RiDeleteBin5Fill}
            color="red"
            onClick={handleUnlink}
            disabled={!selectedContentIds.length}
          >
            {selectedContentIds.length}件を削除する
          </ToolParts>
          <ToolParts
            icon={IoIosBrowsers}
            color="blue"
            onClick={handleBundleContents}
            disabled={selectedContentIds.length < 2}
          >
            差分コレクションを作る
          </ToolParts>
        </ToolPartsSet>
        <ToolParts icon={ImImage} onClick={rotateThumbSize}>
          <>
            サムネイルサイズ：
            <span className={styles.thumbSize}>{THUMB_SIZES[thumbSizeIndex]}</span>
          </>
        </ToolParts>
      </div>
      <div
        className={clsx(
          styles.container,
          { [styles.thumbSmall]: THUMB_SIZES[thumbSizeIndex] === 'small' },
          { [styles.thumbLarge]: THUMB_SIZES[thumbSizeIndex] === 'large' },
          { [styles.selectable]: isSelectable }
        )}
      >
        {contents.map((content, index) => (
          <Thumbnail
            key={index}
            content={content}
            isSelected={selectedContentIds.includes(content.id)}
            isSelectable={isSelectable}
            selectedOrder={selectedContentIds.indexOf(content.id) + 1}
            onSelect={(contentId, shiftKey) => onSelect(contentId, index, shiftKey)}
            onChangeIsSelectable={setIsSelectable}
          />
        ))}
      </div>
    </>
  );
};
