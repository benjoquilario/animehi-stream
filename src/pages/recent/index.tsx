import api from '@/utils/request';
import { InferGetStaticPropsType } from 'next';
import { META } from '@consumet/extensions';

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
  const anilist = new META.Anilist();
  const data = await anilist.fetchRecentEpisodes('gogoanime', RECENT_PAGE, 24);
  const recentRelease = JSON.parse(JSON.stringify(data));

  return {
    props: {
      recentRelease,
      totalRelease: recentRelease.totalPages,
      currentPage: 2,
    },
  };
};

export default RecentPage;
