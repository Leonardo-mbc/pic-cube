import { PaginationItem } from './item';
import styles from './styles.module.css';

interface PaginationProps {
  page: number; // start from 1
  size: number;
  radius?: number;
  href?: (page: number) => string;
  onChangePage: (page: number) => void;
}

export const Pagination = ({
  page,
  size,
  radius: radiusRaw = 4,
  href = (page) => `?page=${page - 1}`,
  onChangePage,
}: PaginationProps) => {
  const radius = Math.max(radiusRaw, 3);
  const width = radius * 2 + 1;
  const useOmittedItemOnLeft = size <= width ? false : page - radius > 1;
  const useOmittedItemOnRight = size <= width ? false : page + radius < size;
  const minViewableRadius = radius - 2; // Minimum radius excluding omitted items
  let viewableFirst: number;
  let viewableLast: number;
  if (useOmittedItemOnLeft) {
    if (useOmittedItemOnRight) {
      viewableFirst = page - minViewableRadius;
    } else {
      viewableFirst = size - radius * 2 + 2;
    }
  } else {
    viewableFirst = 1;
  }
  if (useOmittedItemOnRight) {
    if (useOmittedItemOnLeft) {
      viewableLast = page + minViewableRadius;
    } else {
      viewableLast = radius * 2 - 1;
    }
  } else {
    viewableLast = size;
  }
  const viewableSize = Math.min(viewableLast - viewableFirst + 1, size);
  const viewablePages = [...Array(viewableSize)].map((_, i) => i + viewableFirst);
  return (
    <div className={styles.container}>
      <PaginationItem
        label="＜"
        page={page - 1}
        href={href}
        onClick={() => onChangePage(page - 1)}
        disabled={page === 1}
      />
      {useOmittedItemOnLeft && (
        // Omitted items to the left
        <>
          <PaginationItem
            label="1"
            page={1}
            href={href}
            onClick={() => onChangePage(1)}
            selected={1 === page}
          />
          <span className={styles.omission}>…</span>
        </>
      )}
      {viewablePages.map((viewablePage) => (
        // Viewable items
        <PaginationItem
          key={viewablePage}
          label={`${viewablePage}`}
          page={viewablePage}
          href={href}
          onClick={() => onChangePage(viewablePage)}
          selected={viewablePage === page}
        />
      ))}
      {useOmittedItemOnRight && (
        // Omitted items to the right
        <>
          <span className={styles.omission}>…</span>
          <PaginationItem
            label={`${size}`}
            page={size}
            href={href}
            onClick={() => onChangePage(size)}
            selected={size === page}
          />
        </>
      )}
      <PaginationItem
        label="＞"
        page={page + 1}
        href={href}
        onClick={() => onChangePage(page + 1)}
        disabled={page === size}
      />
    </div>
  );
};
