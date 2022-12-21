import clsx from 'clsx';
import styles from './styles.module.css';

interface PaginationItemProps {
  page: number;
  createHref?: (page: number) => string;
  onClick: () => void;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export const PaginationItem = ({
  page,
  createHref = (page) => `?page=${page}`,
  label,
  onClick,
  selected,
  disabled,
}: PaginationItemProps) => {
  return (
    <a
      className={clsx(styles.button, { [styles.selected]: selected })}
      href={disabled ? undefined : createHref(page)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {label}
    </a>
  );
};
