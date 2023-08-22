import React from "react"
import { NextPage } from "next"
import NextErrorComponent, { ErrorProps } from "next/error"
import Link from "next/link"
import { NextSeo } from "next-seo"

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun: boolean
  err?: Error & {
    statusCode: number
  }
}

// @ts-ignore
const ErrorPage: NextPage<CustomErrorProps, CustomErrorProps> = ({
  statusCode,
  err,
}) => {
  return (
    <React.Fragment>
      <NextSeo
        title={`An error occured ${statusCode} - AnimeHi`}
        description="404 Not Found"
      />
      <div className="relative flex min-h-screen w-full items-center justify-center">
        <div className="fixed z-0 flex h-full w-full items-center justify-center">
          <h1 className="text-[30vw] font-bold text-gray-500">{statusCode}</h1>
          <div className="absolute inset-0 h-full w-full bg-black/90"></div>
        </div>
        <div className="relative z-10 flex h-full w-full flex-col items-center px-4 text-center md:px-12 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="mb-4 text-slate-300">
            <span className="text-lg">
              Welcome to
              <span className="opacity-300 text-primary">
                the {statusCode} dimension
              </span>
            </span>
          </div>
          <p className="text-4xl font-semibold text-white">
            You have discovered a new dimension
          </p>
          <p className="mt-4 text-2xl text-slate-200">{`Error: ${err}`}</p>
          <Link href="/">
            <a>
              <button
                type="button"
                className="mt-8 flex items-center space-x-2 rounded-md border-2 border-primary px-3 py-2 text-base transition duration-300 hover:bg-primary hover:bg-opacity-80"
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
  )
}

// @ts-ignore
ErrorPage.getInitialProps = async (context) => {
  return await NextErrorComponent.getInitialProps(context)
}

export default ErrorPage
