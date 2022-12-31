import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
  return (
    <React.Fragment>
      <NextSeo title="An error occured (404)" description="404 Not Found" />
      <div className="relative w-full min-h-screen flex justify-center items-center">
        <div className="fixed z-0 w-full h-full flex items-center justify-center">
          <h1 className="font-bold text-[30vw] text-gray-500">404</h1>
          <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
        </div>
        <div className="px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36 relative z-10 flex flex-col items-center w-full h-full text-center ">
          <div className="mb-4 text-slate-300">
            <span className="text-lg">
              Welcome to
              <span className="text-primary opacity-300">
                the 404 dimension
              </span>
            </span>
          </div>
          <p className="text-4xl font-semibold text-white">
            You have discovered a new dimension
          </p>
          <p className="text-2xl text-slate-200 mt-4">
            But unfortunately, this dimension has nothing at all
          </p>
          <Link href="/">
            <a>
              <button
                type="button"
                className="transition duration-300 text-base flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-opacity-80 mt-8 hover:bg-primary border-2 border-primary"
              >
                <p className="text-lg text-slate-300">
                  Go back to the old dimension
                </p>
              </button>
            </a>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ErrorPage;
