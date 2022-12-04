import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ContentsPanel, Content as ContentsPanelContent } from '../components/contents-panel';
import styles from './index/styles.module.css';
import { PageTitle } from '../components/page-title';
import { sdk } from '../utilities/api';
import { useContents } from '../page-modules/index/use-contents';
import { useDisplayContent } from '../page-modules/index/use-display-content';
import { Content } from '../page-modules/index/types';
import { useDisplayId } from '../page-modules/index/use-display-id';
import { PreviewScreen } from '../components/contents-panel/preview-screen';
import { usePrefetchContentIds } from '../page-modules/index/use-prefetch-content-ids';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useContentsPanelContents } from '../page-modules/index/use-contents-panel-contents';

interface IndexProps {
  contents: Content[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { Contents } = await sdk.getContents({ removed: false });
  const props: IndexProps = { contents: Contents };
  return { props };
};

const Index: NextPage<IndexProps> = (props) => {
  const router = useRouter();
  const { contents: contentsRaw, refetchContents: refetchContentsRaw } = useContents(
    props.contents
  );
  const { contents } = useContentsPanelContents({ contents: contentsRaw });
  const displayId = useDisplayId();
  const prefetchIds = usePrefetchContentIds({ displayId, contents: contentsRaw });
  const { displayContent, nextDisplayContent, prevDisplayContent } = useDisplayContent({
    contents: contentsRaw,
    prefetchIds,
    displayId,
  });

  async function handleBundleContents(selectedContentIds: number[]) {
    const selectedContents = selectedContentIds
      .map((id) => contentsRaw.find((content) => content.id === id))
      .filter((content): content is Content => !!content);

    const collections = selectedContents.filter((content) => content.collection);
    const files = selectedContents
      .map((content) => {
        if (content.collection) {
          return content.collection.contents;
        }
        return [content];
      })
      .flat();

    const firstFile = files[0];
    if (!firstFile) {
      throw new Error('selectedContentIds requires at least one more content id');
    }

    await Promise.all(collections.map((collection) => sdk.removeContent({ id: collection.id })));
    await sdk.createContentAsCollection({
      name: firstFile.name,
      contentIds: files.map((file) => file.id),
    });
    await refetchContentsRaw();
  }

  async function handleUnlinkContents(selectedContentIds: number[]) {
    const selectedContents = selectedContentIds
      .map((id) => contents.find((content) => content.id === id))
      .filter((content): content is ContentsPanelContent => !!content);
    await Promise.all(selectedContents.map((content) => sdk.removeContent({ id: content.id })));
    await refetchContentsRaw();
  }

  function handleClosePreview() {
    router.back();
  }

  const handleChangeContent = useCallback(
    ({ id }: { id: number }) => {
      router.replace(`?display=${id}`, undefined, { shallow: true });
    },
    [router]
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>pic-cube</title>
      </Head>
      <PageTitle title="最近追加したもの" />
      <ContentsPanel
        contents={contents}
        onBundleContents={handleBundleContents}
        onUnlinkContents={handleUnlinkContents}
      />
      {displayContent && (
        <PreviewScreen
          key={displayContent.id}
          content={displayContent}
          nextContent={nextDisplayContent}
          prevContent={prevDisplayContent}
          onClose={handleClosePreview}
          onChangeContent={handleChangeContent}
        />
      )}
    </div>
  );
};

export default Index;
