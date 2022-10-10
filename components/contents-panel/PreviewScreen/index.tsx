import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Element, scroller, animateScroll as scroll } from 'react-scroll';
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from 'react-icons/ai';
import styles from './styles.module.css';
import clsx from 'clsx';
import { extructContentsState } from '../state';
import { useRecoilValue } from 'recoil';
import { makeContentPath } from '../../../utilities/make-path';
import type { ContentsTableWithCollections } from '../../../interfaces/db';

interface PreviewScreenProps {}

export const PreviewScreen: React.FC<PreviewScreenProps> = (props) => {
  const router = useRouter();
  const [dispContentId, setDispContentId] = useState<number>();
  const [childContentIndex, setChildContentIndex] = useState<number>(0);
  const [isOriginalSize, setIsOriginalSize] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const childContainerRef = useRef<HTMLDivElement>(null);
  const { content, nextContent, prevContent } = useRecoilValue(extructContentsState(dispContentId));

  const hasPrevChildContent = !!content?.contents[childContentIndex - 1];
  const hasNextChildContent = !!content?.contents[childContentIndex + 1];

  useEffect(() => {
    const id = router.query.display;
    if (id) {
      const contentId = parseInt(Array.isArray(id) ? id[0] : id);
      setDispContentId(contentId);
      setChildContentIndex(0);
    } else {
      close();
    }
  }, [router.query.display]);

  useEffect(() => {
    const childContent = content?.contents[childContentIndex];

    if (childContent && childContainerRef.current) {
      setChildContent(childContent);

      const offset = -childContainerRef.current.getBoundingClientRect().width / 2 + 53;
      scroller.scrollTo(`ps-child-${childContentIndex}`, {
        duration: 350,
        smooth: 'easeOutQuad',
        container: childContainerRef.current,
        horizontal: true,
        offset,
      });
    }
  }, [childContentIndex]);

  function setChildContent(childContent: ContentsTableWithCollections) {
    if (imageRef.current) {
      imageRef.current.src = makeContentPath(childContent);
    }
  }

  function handleFullScreen(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    if (imageRef.current) {
      setIsOriginalSize(!isOriginalSize);
    }
  }

  function close() {
    setDispContentId(undefined);
    setIsOriginalSize(false);
    setChildContentIndex(0);

    router.back();
  }

  function handlePagination(e: React.MouseEvent<HTMLDivElement>, direction: 'prev' | 'next') {
    e.stopPropagation();

    switch (direction) {
      case 'prev': {
        if (hasPrevChildContent) {
          setChildContent(content.contents[childContentIndex - 1]);
          setChildContentIndex(childContentIndex - 1);
        } else if (prevContent) {
          router.replace(`?display=${prevContent.id}`, undefined, { shallow: true });
        }
        break;
      }
      case 'next': {
        if (hasNextChildContent) {
          setChildContent(content.contents[childContentIndex + 1]);
          setChildContentIndex(childContentIndex + 1);
        } else if (nextContent) {
          router.replace(`?display=${nextContent.id}`, undefined, { shallow: true });
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
      onClick={isOriginalSize ? handleFullScreen : close}>
      {content && (
        <>
          <img ref={imageRef} className={styles.image} src={makeContentPath(content)} />
          <div
            className={clsx(styles.pagination, styles.prev, {
              [styles.showPagination]: prevContent || hasPrevChildContent,
            })}
            onClick={(e) => handlePagination(e, 'prev')}></div>
          <div
            className={clsx(styles.pagination, styles.next, {
              [styles.showPagination]: nextContent || hasNextChildContent,
            })}
            onClick={(e) => handlePagination(e, 'next')}></div>
          {content.contents.length > 0 && !isOriginalSize && (
            <div
              ref={childContainerRef}
              className={styles.childContents}
              onClick={(e) => e.stopPropagation()}>
              {content.contents.map((content, index) => {
                const base64String = Buffer.from(content.thumbnail.data).toString('base64');
                const thumbData = `data:image/jpeg;base64,${base64String}`;
                return (
                  <Element key={index} name={`ps-child-${index}`} className={styles.scrollElement}>
                    <img
                      className={clsx({ [styles.selected]: childContentIndex === index })}
                      src={thumbData}
                      onClick={() => setChildContentIndex(index)}
                    />
                  </Element>
                );
              })}
            </div>
          )}
          <div className={styles.toolContainer}>
            <div className={styles.toolButton} onClick={handleFullScreen}>
              {isOriginalSize ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
