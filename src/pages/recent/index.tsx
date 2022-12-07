import api from '@/utils/request';
import { InferGetStaticPropsType } from 'next';

const RecentPage = ({
  recentRelease,
  totalRelease,
  currentPage,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log(recentRelease);
  return <div>Hello world</div>;
};

export const getStaticProps = async () => {
  const RECENT_PAGE = 2;
  const recentRelease = await api.recentRelease(RECENT_PAGE);

  return {
    props: {
      recentRelease,
      totalRelease: recentRelease.totalPages,
      currentPage: 2,
    },
  };
};

export default RecentPage;
