import { useState } from 'react';
import { sdk } from '../../utilities/api';
import { Content } from './types';

export const useContents = (initialContents: Content[]) => {
  const [contents, setContents] = useState(initialContents);
  return {
    contents,
    refetchContents: async () => {
      const { Contents } = await sdk.getContents({ removed: false });
      setContents(Contents);
    },
  };
};
