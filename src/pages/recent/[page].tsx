import api from '@/utils/request';
import useSWR from 'swr';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { META } from '@consumet/extensions';
import { GOGO_PROVIDER } from '@/utils/config';
import { useRouter } from 'next/router';
import { useDispatch, initialiseStore, useSelector } from '@/store/store';
import { BASE_URL } from '@/utils/config';
import React, { useRef, useEffect } from 'react';
import {
  setCurrentPage,
  increasePage,
  decreasePage,
} from '@/store/recent/slice';
import { useState } from 'react';

const RecentPage = ({
  recentRelease,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [recent, setRecent] = useState(recentRelease);
  const dispatch = useDispatch();
  const routerRef = useRef(router);
  const page = useSelector(store => store.recent.page);
  const [pageNumber, setPageNumber] = useState(1);

  const fetcher = async (page: number) =>
    fetch(
      `${BASE_URL}/meta/anilist/recent-episodes?page=${page}&perPage=12`
    ).then(res => res.json());

  const { data, error } = useSWR([pageNumber], fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (!data && !error) return;

    setRecent(data);
  }, [data, error]);

  console.log(recent);

  return (
    <div>
      <button onClick={() => setPageNumber(pageNumber + 1)}>+ page</button>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const anilist = new META.Anilist();
  const store = initialiseStore();
  const PAGE = 2;

  const data = await anilist.fetchRecentEpisodes(GOGO_PROVIDER, PAGE, 12);

  const recentRelease = JSON.parse(JSON.stringify(data));

  return {
    props: {
      recentRelease,
      initialReduxState: store.getState(),
    },
  };
};

export default RecentPage;
