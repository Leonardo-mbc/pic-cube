import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
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

  // TODO: width が付いてしまっているので内部のボタンサイズが変わっても検知できてない

  function measureWidth() {
    if (buttonRef.current && innerRef.current) {
      const { width } = buttonRef.current.getBoundingClientRect();
      const { width: innerWidth } = innerRef.current.getBoundingClientRect();

      if (props.isOpen) {
        setContainerWidth(width + innerWidth + 10);
      } else {
        setContainerWidth(width);
      }
    }
  }

  useEffect(() => {
    measureWidth();
  }, [buttonRef.current, innerRef.current, props.isOpen]);

  useResizeObserver(innerRef, measureWidth);

  useEffect(() => {
    setTimeout(() => {
      if (!withTransition) {
        setWithTransition(true);
      }
    }, 300);
  }, []);

  return (
    <div
      style={{ width: containerWidth }}
      className={clsx(styles.toolsPartsSet, {
        [styles.withTransition]: withTransition,
        [styles.isClose]: withTransition && !props.isOpen,
      })}>
      <div ref={buttonRef}>{props.button}</div>
      <div ref={innerRef} className={styles.inner}>
        {props.children}
      </div>
    </div>
  );
};
