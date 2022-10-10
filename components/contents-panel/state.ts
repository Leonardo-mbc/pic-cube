import { atom, selector, selectorFamily } from 'recoil';
import { ContentsWithChildItems } from '../../interfaces/db';

export const contentsState = atom<ContentsWithChildItems[]>({
  key: 'atom:contents-panel:contents',
  default: [],
});

export const unlinkedContentIdsState = atom<number[]>({
  key: 'atom:contents-panel:unlinkedContentIds',
  default: [],
});

export const filteredContentsState = selector<ContentsWithChildItems[]>({
  key: 'atom:contents-panel:filteredContents',
  get: ({ get }) => {
    const contents = get(contentsState);
    const unlinkedContentIds = get(unlinkedContentIdsState);
    return contents.filter((c) => !unlinkedContentIds.includes(c.id));
  },
});

export const extructContentsState = selectorFamily<
  {
    content: ContentsWithChildItems | undefined;
    nextContent: ContentsWithChildItems | undefined;
    prevContent: ContentsWithChildItems | undefined;
  },
  number | undefined
>({
  key: 'atom:contents-panel:extructContents',
  get:
    (contentId) =>
    ({ get }) => {
      const contents = get(filteredContentsState);
      const targetId = contents.findIndex((c) => c.id === contentId);

      if (targetId < 0) {
        return {
          content: undefined,
          nextContent: undefined,
          prevContent: undefined,
        };
      } else {
        return {
          content: contents[targetId],
          nextContent: contents[targetId + 1],
          prevContent: contents[targetId - 1],
        };
      }
    },
});

export const isSelectableState = atom<boolean>({
  key: 'atom:contents-panel:isSelectable',
  default: false,
});

export const selectedThumbsState = atom<number[]>({
  key: 'atom:contents-panel:selectedThumbs',
  default: [],
});

export const selectedCollectionsState = atom<number[]>({
  key: 'atom:contents-panel:selectedCollections',
  default: [],
});
