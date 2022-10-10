import clsx from 'clsx';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import styles from './styles.module.css';

interface ToolPartsProps {
  icon: IconType;
  onClick: () => void;
  children: ReactNode;
  color?: 'blue' | 'red';
  disabled?: boolean;
}

export const ToolParts: React.FC<ToolPartsProps> = (props) => {
  function handleClick() {
    if (props.onClick && !props.disabled) {
      props.onClick();
    }
  }
  return (
    <div
      className={clsx(styles.toolsParts, styles.likeButton, {
        [styles[props.color!]]: props.color,
        [styles.disabled]: props.disabled,
      })}
      onClick={handleClick}>
      <props.icon />
      <span>{props.children}</span>
    </div>
  );
};
