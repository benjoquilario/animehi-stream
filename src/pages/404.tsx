import DefaultLayout from '@/components/layouts/default';
import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
  return (
    <DefaultLayout>
      <div className="relative w-full min-h-screen flex justify-center items-center">
        <div className="flex justify-center items-center gap-2">
          <h1 className="font-bold text-white text-[17vw] bg-primary rounded-md">
            404
          </h1>
          <div className="relative">
            <p className="text-[9vw] text-slate-300">NOT FOUND</p>
            <Link href={`/`}>
              <a className="absolute left-3 bottom-3 text-white">
                Back to home
              </a>
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ErrorPage;
