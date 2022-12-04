import { useMemo } from 'react';
import { Content } from './types';

interface UsePrefetchContentIdsParams {
  displayId: number | undefined;
  contents: Content[];
}

export const usePrefetchContentIds = ({ displayId, contents }: UsePrefetchContentIdsParams) => {
  return useMemo(() => {
    if (displayId === undefined) {
      return [];
    }

    const displayIndex = contents.findIndex((content) => content.id === displayId);
    return [contents[displayIndex + 1]?.id, contents[displayIndex + 1]?.id].filter(
      (x): x is number => !!x
    );
  }, [displayId, contents]);
};
