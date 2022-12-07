import '@/styles/globals.css';
import { ReactElement, ReactNode, useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useStore } from 'store/store';
import { Provider } from 'react-redux';
import Router from 'next/router';
import progressBar from '@/components/shared/loading';
import { DefaultSeo } from 'next-seo';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // const getLayout = Component.getLayout(page => page);
  const reduxStore = useStore(pageProps.initialReduxState);
  useEffect(() => {
    Router.events.on('routeChangeStart', progressBar.start);
    Router.events.on('routeChangeComplete', progressBar.finish);
    Router.events.on('routeChangeError', progressBar.finish);

    return () => {
      Router.events.off('routeChangeStart', progressBar.start);
      Router.events.off('routeChangeComplete', progressBar.finish);
      Router.events.off('routeChangeError', progressBar.finish);
    };
  }, []);

  return (
    <>
      <DefaultSeo
        title="AnimeHi - Watch animes without ads"
        description="Watch anime shows, tv, movies for free without ads in your mobile, tablet or pc"
      />
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
