import { Element, scroller } from 'react-scroll';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Content } from '.';
import styles from './styles.module.css';

interface PreviewScreenFooterProps {
  content: Content;
  childContentIndex: number;
  setChildContentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const PreviewScreenFooter: React.FC<PreviewScreenFooterProps> = ({
  content,
  childContentIndex,
  setChildContentIndex,
}) => {
  const childContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const childContent = content.collection?.contents[childContentIndex];
    if (childContent && childContainerRef.current) {
      const offset = -childContainerRef.current.getBoundingClientRect().width / 2 + 53;
      scroller.scrollTo(`ps-child-${childContentIndex}`, {
        duration: 350,
        smooth: 'easeOutQuad',
        container: childContainerRef.current,
        horizontal: true,
        offset,
      });
    }
  }, [content, childContentIndex]);

  return (
    <footer>
      {content.collection && content.collection.contents.length > 0 && (
        <div
          ref={childContainerRef}
          className={styles.childContents}
          onClick={(e) => e.stopPropagation()}
        >
          {content.collection.contents.map((content, index) => {
            return (
              <Element key={index} name={`ps-child-${index}`} className={styles.scrollElement}>
                <picture>
                  <img
                    className={clsx({ [styles.selected]: childContentIndex === index })}
                    src={content.thumbnailUrl}
                    onClick={() => setChildContentIndex(index)}
                    alt={`${content.name}_${index}`}
                  />
                </picture>
              </Element>
            );
          })}
        </div>
      )}
    </footer>
  );
};
