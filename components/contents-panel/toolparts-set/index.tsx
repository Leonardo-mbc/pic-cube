import clsx from 'clsx';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

  useLayoutEffect(() => {
    if (buttonRef.current && innerRef.current) {
      const { width } = buttonRef.current.getBoundingClientRect();
      const { width: innerWidth } = innerRef.current.getBoundingClientRect();

      if (props.isOpen) {
        setContainerWidth(width + innerWidth + 10);
      } else {
        setContainerWidth(width);
      }
    }
  }, [buttonRef.current, innerRef.current, props.isOpen]);

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
      <div className={styles.button} ref={buttonRef}>
        {props.button}
      </div>
      <div ref={innerRef} className={styles.inner}>
        {props.children}
      </div>
    </div>
  );
};
