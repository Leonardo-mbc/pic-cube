import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { parseQueryParams } from './parse-query-params';

export const useQueryParams = () => {
  const { query } = useRouter();
  return useMemo(() => {
    return parseQueryParams(query);
  }, [query]);
};
