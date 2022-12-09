import api from '@/utils/request';
import { GetStaticPaths } from 'next';
import { InferGetStaticPropsType } from 'next';

export const PER_PAGE = 24;

const RecentReleasePage = ({
  recentRelease,
  totalPages,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(recentRelease);
  return <div></div>;
};

export const getStaticProps = async ({ params }: any) => {
  const page = Number(params?.page) || 1;

  const recentRelease = await api.recentRelease(page);

  if (!recentRelease) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      recentRelease,
      totalPages: recentRelease.totalPages,
      currentPage: page,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Prerender the next 24 pages after the first page, which is handled by the index page.
    // Other pages will be prerendered at runtime.
    paths: Array.from({ length: 24 }).map((_, i) => `/recent/${i + 2}`),
    // Block the request for non-generated pages and cache them in the background
    fallback: 'blocking',
  };
};

export default RecentReleasePage;
