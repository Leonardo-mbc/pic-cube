import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import styles from './styles.module.css';

interface ToolPartsSetProps {
  button: ReactNode;
  isOpen: boolean;
  children: ReactNode;
}

export const ToolPartsSet: React.FC<ToolPartsSetProps> = (props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [withTransition, setWithTransition] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const measureWidth = useCallback(() => {
    if (buttonRef.current && innerRef.current) {
      const { width } = buttonRef.current.getBoundingClientRect();
      const { width: innerWidth } = innerRef.current.getBoundingClientRect();

      if (props.isOpen) {
        setContainerWidth(width + innerWidth + 10);
      } else {
        setContainerWidth(width);
      }
    }
  }, [props.isOpen]);

  useEffect(() => {
    measureWidth();
  }, [measureWidth]);

  useResizeObserver(innerRef, measureWidth);

  useEffect(() => {
    setTimeout(() => {
      if (!withTransition) {
        setWithTransition(true);
      }
    }, 300);
  }, [withTransition]);

  return (
    <div
      style={{ width: containerWidth }}
      className={clsx(styles.toolsPartsSet, {
        [styles.withTransition]: withTransition,
        [styles.isClose]: withTransition && !props.isOpen,
      })}
    >
      <div ref={buttonRef}>{props.button}</div>
      <div ref={innerRef} className={styles.inner}>
        {props.children}
      </div>
    </div>
  );
};
