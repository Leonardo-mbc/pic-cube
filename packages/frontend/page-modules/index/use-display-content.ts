import { useEffect, useMemo, useState } from 'react';
import { Content as PreviewScreenContent } from '../../components/contents-panel/preview-screen';
import { sdk } from '../../utilities/api';
import { convertUrls } from './convert-urls';
import { Content } from './types';

const mapContent = (content: Content | undefined): PreviewScreenContent | undefined => {
  if (!content) {
    return;
  }

  const { filepath, thumbnailUrl } = convertUrls(content);
  const collection = content.collection
    ? {
        contents: content.collection.contents.map((content) => {
          const { filepath, thumbnailUrl } = convertUrls(content);

          return {
            id: content.id,
            name: content.name,
            imageUrl: filepath,
            thumbnailUrl,
            file: content.file || undefined,
          };
        }),
      }
    : undefined;

  return {
    id: content.id,
    name: content.name,
    imageUrl: filepath,
    thumbnailUrl,
    file: content.file || undefined,
    collection,
  };
};

interface UseDisplayContentParams {
  displayId?: number;
  prefetchIds: number[];
  contents: Content[];
}

export const useDisplayContent = ({
  contents,
  displayId,
  prefetchIds,
}: UseDisplayContentParams) => {
  const [contentMap, setContentMap] = useState<{ [id in number]?: Content }>({});

  const displayIndex = useMemo(() => {
    return contents.findIndex((content) => content.id === displayId);
  }, [displayId, contents]);

  const displayContent: PreviewScreenContent | undefined = useMemo(() => {
    return mapContent(displayId === undefined ? undefined : contentMap[displayId]);
  }, [displayId, contentMap]);

  const nextDisplayContent = useMemo(
    () => mapContent(contents[displayIndex + 1]),
    [contents, displayIndex]
  );
  const prevDisplayContent = useMemo(
    () => mapContent(contents[displayIndex - 1]),
    [contents, displayIndex]
  );

  // Create contentMap from contents
  useEffect(() => {
    setContentMap((prev) => {
      const newContentMap = { ...prev };
      for (const content of contents) {
        newContentMap[content.id] = content;
      }
      return newContentMap;
    });
  }, [contents]);

  // Fetch content and set to contentMap
  useEffect(() => {
    async () => {
      if (displayId === undefined) {
        return;
      }

      const targetIds = [displayId, ...prefetchIds].filter((id) => !contentMap[id]);
      const targets = await Promise.all(targetIds.map((id) => sdk.getContentById({ id })));
      setContentMap((prev) => {
        const newContentMap = { ...prev };
        for (const { Content } of targets) {
          if (Content) {
            newContentMap[Content.id] = Content;
          }
        }
        return newContentMap;
      });
    };
  }, [displayId, prefetchIds, contentMap]);

  return {
    displayContent,
    nextDisplayContent,
    prevDisplayContent,
  };
};
