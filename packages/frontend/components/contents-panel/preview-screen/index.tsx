import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import styles from './styles.module.css';
import clsx from 'clsx';
import { PreviewScreenFooter } from './footer';

export interface Content {
  id: number;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  file?: {
    path: string;
    filename: string;
  };
  collection?: {
    contents: {
      id: number;
      name: string;
      imageUrl: string;
      thumbnailUrl: string;
      file?: {
        path: string;
        filename: string;
      };
    }[];
  };
}

interface PreviewScreenProps {
  content: Content;
  prevContent?: Content;
  nextContent?: Content;
  onClose?: () => void;
  onChangeContent?: (content: Content) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  content,
  prevContent,
  nextContent,
  onClose,
  onChangeContent,
}: PreviewScreenProps) => {
  const [childContentIndex, setChildContentIndex] = useState<number>(0);
  const [isOriginalSize, setIsOriginalSize] = useState(false);

  const hasPrevChildContent = !!content.collection?.contents[childContentIndex - 1];
  const hasNextChildContent = !!content.collection?.contents[childContentIndex + 1];

  const { imageUrl, contentName, fileInfo } = useMemo(() => {
    if (content.collection) {
      const selectedContent = content.collection.contents[childContentIndex];
      return {
        imageUrl: selectedContent.imageUrl,
        contentName: selectedContent.name,
        fileInfo: selectedContent.file,
      };
    }
    return { imageUrl: content.imageUrl, contentName: content.name, fileInfo: content.file };
  }, [childContentIndex, content]);

  const close = useCallback(() => {
    setIsOriginalSize(false);

    if (onClose) {
      onClose();
    }
  }, [onClose]);

  function handleFullScreen(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setIsOriginalSize(!isOriginalSize);
  }

  function handlePagination(
    e: React.MouseEvent<HTMLDivElement>,
    direction: 'prev' | 'next',
    skipChildContent = false
  ) {
    e.stopPropagation();

    switch (direction) {
      case 'prev': {
        if (hasPrevChildContent && !skipChildContent) {
          setChildContentIndex(childContentIndex - 1);
        } else if (prevContent && onChangeContent) {
          onChangeContent(prevContent);
        }
        break;
      }
      case 'next': {
        if (hasNextChildContent && !skipChildContent) {
          setChildContentIndex(childContentIndex + 1);
        } else if (nextContent && onChangeContent) {
          onChangeContent(nextContent);
        }
        break;
      }
    }

    setIsOriginalSize(false);
  }

  return (
    <div
      className={clsx(styles.container, {
        [styles.show]: content,
        [styles.originalSize]: isOriginalSize,
      })}
    >
      {content && (
        <>
          <div className={styles.contents} onClick={isOriginalSize ? handleFullScreen : close}>
            <picture>
              <img className={styles.image} src={imageUrl} alt={content.name} />
            </picture>
            <div className={styles.parts}>
              <div
                className={clsx(styles.pagination, styles.prev, {
                  [styles.showPagination]: prevContent || hasPrevChildContent,
                })}
                onClick={(e) => handlePagination(e, 'prev')}
              >
                <div
                  className={styles.sideContentThumb}
                  onClick={(e) => handlePagination(e, 'prev', true)}
                >
                  {prevContent && (
                    <picture>
                      <img src={prevContent.thumbnailUrl} alt={prevContent.name} />
                    </picture>
                  )}
                </div>
              </div>
              <div
                className={clsx(styles.pagination, styles.next, {
                  [styles.showPagination]: nextContent || hasNextChildContent,
                })}
                onClick={(e) => handlePagination(e, 'next')}
              >
                <div
                  className={styles.sideContentThumb}
                  onClick={(e) => handlePagination(e, 'next', true)}
                >
                  {nextContent && (
                    <picture>
                      <img src={nextContent.thumbnailUrl} alt={nextContent.name} />
                    </picture>
                  )}
                </div>
              </div>
              {!isOriginalSize && (
                <PreviewScreenFooter
                  content={content}
                  childContentIndex={childContentIndex}
                  setChildContentIndex={setChildContentIndex}
                />
              )}

              <div className={styles.toolContainer}>
                <div className={styles.toolButton} onClick={handleFullScreen}>
                  {isOriginalSize ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.details}>
            <div className={styles.contentTitle}>
              <h1>{contentName}</h1>
              {fileInfo && <span>{[fileInfo.path, fileInfo.filename].join('/')}</span>}
            </div>
            <div className={styles.tags}>
              <ul>
                <li>tag</li>
                <li>タグ</li>
                <li>すこしながいなまえのたぐ</li>
                <li>taaaaaaaaaaaaaaaaaaaaaaaag</li>
                <li>tag</li>
                <li>タグ</li>
                <li>すこしながいなまえのたぐ</li>
                <li>taaaaaaaaaaaaaaaaaaaaaaaag</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
