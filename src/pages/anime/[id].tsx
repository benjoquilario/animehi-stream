import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import AnimeDetails from '@/components/anime/details';
import Header from '@/components/header/header';
import api from '@/utils/request';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let id = params!.id;

  id = typeof id === 'string' ? id : id!.join(' ');

  const animeList = await api.animeInfo(id);

  return {
    props: {
      animeList,
    },
  };
};

const Anime = ({
  animeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <AnimeDetails animeList={animeList} />;
};

export default Anime;
