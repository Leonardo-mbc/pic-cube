import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ContentsPanel, Content as ContentsPanelContent } from '../components/contents-panel';
import styles from './index/styles.module.css';
import { PageTitle } from '../components/page-title';
import { sdk } from '../utilities/api';
import { useContents } from '../page-modules/index/use-contents';
import { useDisplayContent } from '../page-modules/index/use-display-content';
import { Content } from '../page-modules/index/types';
import { PreviewScreen } from '../components/contents-panel/preview-screen';
import { usePrefetchContentIds } from '../page-modules/index/use-prefetch-content-ids';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useContentsPanelContents } from '../page-modules/index/use-contents-panel-contents';
import { Pagination } from '../components/pagination';
import { useQueryParams } from '../page-modules/index/use-query-params';
import { parsePage, parseSize } from '../page-modules/index/parse-query-params';

interface IndexProps {
  contents: Content[];
  contentTotal: number;
  contentLimit: number;
}

export const getServerSideProps: GetServerSideProps = async (params) => {
  const page = parsePage(params.query.page);
  const size = parseSize(params.query.size);
  const offset = Math.max(0, (page - 1) * size);
  const { Contents } = await sdk.getContents({ removed: false, limit: size, offset });
  const props: IndexProps = {
    contents: Contents.contents,
    contentTotal: Contents.total,
    contentLimit: size,
  };
  return { props };
};

const Index: NextPage<IndexProps> = (props) => {
  const router = useRouter();
  const { displayId, page, size } = useQueryParams();
  const {
    contents: contentsRaw,
    refetchContents: refetchContentsRaw,
    contentTotal,
  } = useContents({
    initialContents: props.contents,
    initialContentTotal: props.contentTotal,
    contentPage: page,
    contentLimit: size,
  });
  const { contents } = useContentsPanelContents({ contents: contentsRaw });
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

  function handleChangePage(page: number) {
    router.push(`?page=${page}&size=${size}`, undefined, { shallow: true });
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
      <Pagination
        page={page}
        size={Math.ceil(contentTotal / props.contentLimit)}
        onChangePage={handleChangePage}
      />
    </div>
  );
};

export default Index;
