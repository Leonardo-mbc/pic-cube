import { PaginationItem } from './item';
import styles from './styles.module.css';

interface PaginationProps {
  page: number; // start from 1
  size: number;
  range?: number;
  href?: (page: number) => string;
  onChangePage: (page: number) => void;
}

export const Pagination = ({
  page,
  size,
  range: rangeRaw = 4,
  href = (page) => `?page=${page - 1}`,
  onChangePage,
}: PaginationProps) => {
  const range = Math.max(rangeRaw, 3);
  const width = range * 2 + 1;
  const useOmittedItemOnLeft = size <= width ? false : page - range > 1;
  const useOmittedItemOnRight = size <= width ? false : page + range < size;
  const minViewableRange = range - 2; // Minimum range excluding omitted items
  let viewableFirst: number;
  let viewableLast: number;
  if (useOmittedItemOnLeft) {
    if (useOmittedItemOnRight) {
      viewableFirst = page - minViewableRange;
    } else {
      viewableFirst = size - range * 2 + 2;
    }
  } else {
    viewableFirst = 1;
  }
  if (useOmittedItemOnRight) {
    if (useOmittedItemOnLeft) {
      viewableLast = page + minViewableRange;
    } else {
      viewableLast = range * 2 - 1;
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
