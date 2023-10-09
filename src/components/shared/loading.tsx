import ProgressBar from "@badrap/bar-of-progress"
import classNames from "classnames"
import { ImSpinner2 } from "react-icons/im"

export const LoadingBanner = () => {
  return (
    <div className="relative mt-2 flex h-[326px] min-h-[326px] w-full items-center justify-center overflow-hidden bg-black md:h-[430px] md:min-h-[430px] 2xl:h-[620px] 2xl:min-h-[620px]">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex h-[396px] min-h-[396px] w-[80%] animate-pulse flex-col justify-center pl-[3%] md:h-[430px] md:min-h-[430px] md:w-[40%] md:pl-0 2xl:h-[620px] 2xl:min-h-[620px]">
          <div className="mt-2 h-[30px] w-[60%] rounded-lg bg-[#141313] md:h-[60px]"></div>
          <div className="mt-2 h-[28px] w-full rounded-lg bg-[#141313] md:h-[64px] "></div>
          <div className="mt-2 hidden h-4 w-[80%] rounded-lg bg-[#141313] md:block"></div>
          <div className="flex gap-2">
            <div className="mt-2 h-[45px] w-[135px] rounded-lg bg-[#141313]"></div>
            <div className="mt-2 h-[45px] w-[135px] rounded-lg bg-[#141313]"></div>
          </div>
        </div>
        <div className="absolute mt-4 h-full w-full animate-pulse rounded-lg bg-[#111] md:relative md:h-[305px] md:w-[60%] md:bg-[#141313]"></div>
      </div>
    </div>
  )
}

export const EpisodeLoading = () => (
  <div className="flex w-full flex-col items-center justify-center">
    <div className="mt-4 flex w-full items-center justify-start">
      <ImSpinner2 className="h-10 w-10 animate-spin text-white" />
    </div>
  </div>
)

export const LoadingVideo = ({ classname }: { classname: string }) => {
  return (
    <div className="col-start-1 col-end-6 flex h-[280px] min-h-[280px] w-full flex-col items-center justify-center md:col-start-1 md:col-end-6 md:h-[500px] md:min-h-[550px] xl:col-start-2">
      <div className="flex w-full items-center justify-center">
        <ImSpinner2
          className={classNames("animate-spin text-white", classname)}
        />
      </div>
    </div>
  )
}

const progressBar = new ProgressBar({
  size: 4,
  color: "#6a55fa",
  className: "z-50",
  delay: 100,
})

export default progressBar
