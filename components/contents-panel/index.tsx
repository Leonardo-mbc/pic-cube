import clsx from 'clsx';
import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { HiCursorClick } from 'react-icons/hi';
import { ImImage } from 'react-icons/im';
import { MdCancel } from 'react-icons/md';
import { IoIosBrowsers } from 'react-icons/io';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { ContentsTableWithCollections, ContentsWithChildItems } from '../../interfaces/db';
import { Thumbnail } from './thumbnail';
import {
  filteredContentsState,
  unlinkedContentIdsState,
  isSelectableState,
  selectedThumbsState,
  selectedCollectionsState,
  contentsState,
} from './state';
import { ToolParts } from './toolparts';
import { ToolPartsSet } from './toolparts-set';
import * as dbRequest from '../../requests/db';
import styles from './styles.module.css';
import { PreviewScreen } from './PreviewScreen';

interface ContentsPanelProps {}

export const ContentsPanel: React.FC<ContentsPanelProps> = (props) => {
  const THUMB_SIZES = ['small', 'medium', 'large'] as const;
  const [thumbSizeIndex, setThumbSizeIndex] = useState<number>(1);
  const [isSelectable, setIsSelectable] = useRecoilState(isSelectableState);
  const [selectedThumbs, setSelectedThumbs] = useRecoilState(selectedThumbsState);
  const [selectedCollections, setSelectedCollections] = useRecoilState(selectedCollectionsState);
  const contents = useRecoilValue(filteredContentsState);
  const setContents = useSetRecoilState(contentsState);
  const [unlinkedContentIds, setUnlinkedContentIds] = useRecoilState(unlinkedContentIdsState);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);

  function rotateThumbSize() {
    const index = thumbSizeIndex + 1;
    setThumbSizeIndex(THUMB_SIZES.length <= index ? 0 : index);
  }

  function toggleSelectable() {
    if (isSelectable) {
      setSelectedThumbs([]);
      setSelectedCollections([]);
    }
    setIsSelectable(!isSelectable);
    setLastSelectedIndex(null);
  }

  function onSelect(content: ContentsWithChildItems, selectedIndex: number, shiftKey: boolean) {
    const newSelectedThumbs = [...selectedThumbs];
    const newSelectedCollections = [...selectedCollections];

    function toggleSelect(contentId: number, childContents: ContentsTableWithCollections[]) {
      const thumbIndex = newSelectedThumbs.indexOf(contentId);
      if (0 <= thumbIndex) {
        newSelectedThumbs.splice(thumbIndex, 1);
      } else {
        newSelectedThumbs.push(contentId);
      }

      const [childContent, ...remainingChildContent] = childContents.filter(
        (c) => c.id !== contentId
      );

      if (childContent) {
        toggleSelect(childContent.id, remainingChildContent);
      }
    }

    if (shiftKey && lastSelectedIndex !== null) {
      const diff = selectedIndex - lastSelectedIndex;
      if (diff === 0) {
        return;
      }

      const direction = 0 < diff ? 1 : -1;

      for (let i = lastSelectedIndex; i !== selectedIndex; i += direction) {
        const index = i + direction;
        toggleSelect(contents[index].id, contents[index].contents);
      }
    } else {
      toggleSelect(content.id, content.contents);
    }

    // コレクション選択の処理、これは再帰処理のあとに記述する必要がある
    if (content.collection_id) {
      const CollectionIndex = newSelectedCollections.indexOf(content.collection_id);
      if (0 <= CollectionIndex) {
        newSelectedCollections.splice(CollectionIndex, 1);
      } else {
        newSelectedCollections.push(content.collection_id);
      }
    }

    setSelectedThumbs(newSelectedThumbs);
    setSelectedCollections(newSelectedCollections);
    setLastSelectedIndex(selectedIndex);
  }

  async function handleUnlink() {
    await dbRequest.unlinkContents(selectedThumbs);
    setUnlinkedContentIds([...unlinkedContentIds, ...selectedThumbs]);
    toggleSelectable();
  }

  async function handleBundleContents() {
    const parentContent = contents.find((content) => content.id === selectedThumbs[0]);
    await dbRequest.bundleContents(selectedThumbs, selectedCollections, parentContent?.created_at);
    const { contents: newContents } = await dbRequest.listContents();
    setContents(newContents);
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
            icon={IoIosBrowsers}
            color="blue"
            onClick={handleBundleContents}
            disabled={selectedThumbs.length < 2}>
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
      <PreviewScreen />
    </>
  );
};
