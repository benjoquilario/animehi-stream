import ProgressBar from '@badrap/bar-of-progress';
import classNames from 'classnames';
import { ImSpinner6 } from 'react-icons/im';

export const LoadingBanner = () => {
  return (
    <div className="px-4 relative h-[600px] bg-black overflow-hidden w-full flex justify-center items-center">
      <div className="flex w-full justify-center items-center gap-4">
        <div className="animate-pulse h-[240px] w-[220px] md:h-[340px] md:w-[280px] bg-[#141313] rounded-lg"></div>
        <div className="w-[70%] h-[300px] animate-pulse">
          <div className="mt-2 w-[40%] bg-black h-9 bg-[#141313] rounded-lg"></div>
          <div className="mt-2 w-[30%] bg-black h-4 bg-[#141313] rounded-lg"></div>
          <div className="mt-2 w-full bg-black h-[45%] bg-[#141313] rounded-lg "></div>
          <div className="mt-2 w-[135px] bg-black h-[45px] bg-[#141313] rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingVideo = ({ classname }: { classname: string }) => {
  return (
    <div className="flex flex-col col-start-1 col-end-6 md:col-start-2 md:col-end-6 w-full justify-center items-center h-[394px] md:h-[550px] min-h-[394px] md:min-h-[550px]">
      <div className="w-full flex justify-center items-center">
        <ImSpinner6
          className={classNames('animate-spin text-white', classname)}
        />
      </div>
    </div>
  );
};

const progressBar = new ProgressBar({
  size: 4,
  color: '#6a55fa',
  className: 'z-50',
  delay: 100,
});

export default progressBar;
