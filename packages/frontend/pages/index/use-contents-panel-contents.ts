import { Content } from './types';
import { Content as ContentsPanelContent } from '../../components/contents-panel';
import { convertUrls } from './convert-urls';
import { useMemo } from 'react';

const mapContent = (content: Content): ContentsPanelContent => {
  const { filepath, thumbnailUrl } = convertUrls(content);
  return {
    id: content.id,
    name: content.name,
    link: filepath,
    thumbnailUrl,
    collection: content.collection
      ? { contentIds: content.collection.contents.map((content) => content.id) }
      : undefined,
  };
};

interface UseControlPanelsContentsParams {
  contents: Content[];
}

export const useContentsPanelContents = ({ contents }: UseControlPanelsContentsParams) => {
  return {
    contents: useMemo((): ContentsPanelContent[] => {
      return contents.map(mapContent);
    }, [contents]),
  };
};
