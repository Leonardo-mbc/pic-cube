import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { HiCursorClick } from 'react-icons/hi';
import { ImImage } from 'react-icons/im';
import { MdCancel } from 'react-icons/md';
import { FaLayerGroup } from 'react-icons/fa';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { ContentsTableWithAliasPath } from '../../interfaces/db';
import { Thumbnail } from './thumbnail';
import {
  filteredContentsState,
  unlinkedContentIdsState,
  isSelectableState,
  selectedThumbsState,
} from './state';
import { ToolParts } from './toolparts';
import { ToolPartsSet } from './toolparts-set';
import * as dbRequest from '../../requests/db';
import styles from './styles.module.css';

interface ContentsPanelProps {}

export const ContentsPanel: React.FC<ContentsPanelProps> = (props) => {
  const THUMB_SIZES = ['small', 'medium', 'large'] as const;
  const [thumbSizeIndex, setThumbSizeIndex] = useState<number>(1);
  const [isSelectable, setIsSelectable] = useRecoilState(isSelectableState);
  const [selectedThumbs, setSelectedThumbsState] = useRecoilState(selectedThumbsState);
  const contents = useRecoilValue(filteredContentsState);
  const [unlinkedContentIds, setUnlinkedContentIds] = useRecoilState(unlinkedContentIdsState);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  function rotateThumbSize() {
    const index = thumbSizeIndex + 1;
    setThumbSizeIndex(THUMB_SIZES.length <= index ? 0 : index);
  }

  function toggleSelectable() {
    if (isSelectable) {
      setSelectedThumbsState([]);
    }
    setIsSelectable(!isSelectable);
    setLastSelectedIndex(null);
  }

  function onSelect(content: ContentsTableWithAliasPath, selectedIndex: number, shiftKey: boolean) {
    const newSelectedThumbs = [...selectedThumbs];

    function toggleSelect(contentId: number) {
      const index = newSelectedThumbs.indexOf(contentId);
      if (0 <= index) {
        newSelectedThumbs.splice(index, 1);
      } else {
        newSelectedThumbs.push(contentId);
      }
    }

    if (shiftKey && lastSelectedIndex !== null) {
      const diff = selectedIndex - lastSelectedIndex;
      if (diff === 0) {
        return;
      }

      const direction = 0 < diff ? 1 : -1;

      for (let i = lastSelectedIndex; i !== selectedIndex; i += direction) {
        toggleSelect(contents[i + direction].id);
      }
    } else {
      toggleSelect(content.id);
    }

    setSelectedThumbsState(newSelectedThumbs);
    setLastSelectedIndex(selectedIndex);
  }

  async function handleUnlink() {
    await dbRequest.unlinkContents(selectedThumbs);
    setUnlinkedContentIds([...unlinkedContentIds, ...selectedThumbs]);
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
          }>
          <ToolParts
            icon={RiDeleteBin5Fill}
            color="red"
            onClick={handleUnlink}
            disabled={!selectedThumbs.length}>
            {selectedThumbs.length}件を削除する
          </ToolParts>
          <ToolParts
            icon={FaLayerGroup}
            color="blue"
            onClick={() => {}}
            disabled={!selectedThumbs.length}>
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
        )}>
        {contents.map((content, index) => (
          <Thumbnail
            key={index}
            content={content}
            isSelected={selectedThumbs.includes(content.id)}
            selectedOrder={selectedThumbs.indexOf(content.id) + 1}
            onSelect={(content, shiftKey) => onSelect(content, index, shiftKey)}
          />
        ))}
      </div>
    </>
  );
};
