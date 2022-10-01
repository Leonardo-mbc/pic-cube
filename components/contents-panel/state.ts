import { atom, selector } from 'recoil';
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
