import Home from '@/components/layouts/home';
import React from 'react';
import api from '@/utils/request';
import { InferGetServerSidePropsType } from 'next';
import progressBar from '@/components/shared/loading';

export const getServerSideProps = async () => {
  const trending = await api.trendingAnime();
  const recentRelease = await api.recentRelease(1);

  if (!trending && !recentRelease) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trending,
      recentRelease,
    },
  };
};

const HomePage = ({
  trending,
  recentRelease,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  progressBar.finish();
  return <Home trending={trending} recentRelease={recentRelease} />;
};

export default HomePage;
