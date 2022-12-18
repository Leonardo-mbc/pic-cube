import clsx from 'clsx';
import styles from './styles.module.css';

interface PaginationItemProps {
  page: number;
  href?: (page: number) => string;
  onClick: () => void;
  label: string;
  selected?: boolean;
  disabled?: boolean;
}

export const PaginationItem = ({
  page,
  href = (page) => `?page=${page}`,
  label,
  onClick,
  selected,
  disabled,
}: PaginationItemProps) => {
  return (
    <a
      className={clsx(styles.button, selected ? styles.selected : undefined)}
      href={disabled ? undefined : href(page)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {label}
    </a>
  );
};
