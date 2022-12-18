import { useCallback, useEffect, useRef, useState } from 'react';
import { sdk } from '../../utilities/api';
import { Content } from './types';

interface UseContentsParams {
  initialContents: Content[];
  initialContentTotal: number;
  contentPage: number;
  contentLimit: number;
}

export const useContents = ({
  initialContents,
  initialContentTotal,
  contentPage,
  contentLimit,
}: UseContentsParams) => {
  const [contents, setContents] = useState(initialContents);
  const [contentTotal, setContentTotal] = useState(initialContentTotal);
  const prevContentPageRef = useRef(contentPage);
  const offset = Math.max(0, (contentPage - 1) * contentLimit);
  const refetchContents = useCallback(async () => {
    const { Contents } = await sdk.getContents({ removed: false, limit: contentLimit, offset });
    setContents(Contents.contents);
    setContentTotal(Contents.total);
  }, [contentLimit, offset]);

  useEffect(() => {
    if (prevContentPageRef.current === contentPage) {
      return;
    }
    prevContentPageRef.current = contentPage;
    refetchContents();
  }, [contentPage, refetchContents]);

  return {
    contents,
    contentTotal,
    refetchContents,
  };
};
