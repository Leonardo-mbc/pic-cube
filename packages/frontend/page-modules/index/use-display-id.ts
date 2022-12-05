import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useDisplayId = () => {
  const { query } = useRouter();
  return useMemo(() => {
    if (typeof query.display === 'string') {
      return parseInt(query.display, 10);
    }
  }, [query.display]);
};
