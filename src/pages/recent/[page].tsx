import api from '@/utils/request';
import { GetStaticPaths } from 'next';
import { InferGetStaticPropsType } from 'next';
import { META } from '@consumet/extensions';

export const PER_PAGE = 19;

const RecentReleasePage = ({
  recentRelease,
  totalPages,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(recentRelease);
  return <div>Hello world!!</div>;
};

export const getStaticProps = async ({ params }: any) => {
  const PAGE = Number(params?.page) || 1;

  const anilist = new META.Anilist();
  const recentRelease = await anilist.fetchRecentEpisodes(
    'gogoanime',
    PAGE,
    18
  );

  if (!recentRelease) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recentRelease,
      totalPages: recentRelease.totalPages,
      currentPage: PAGE,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Prerender the next 24 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 19 }).map((_, i) => `/recent/${i + 2}`),
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};

export default RecentReleasePage;
