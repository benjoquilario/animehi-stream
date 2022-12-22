import React from 'react';
import { AiOutlineArrowRight, AiOutlineArrowLeft } from 'react-icons/ai';
import Button from '@/components/shared/button';

type PaginationProps = {
  pageNumber: number;
  setPageNumber: (number: number) => void;
  hasNextPage?: boolean;
};

const Pagination = ({
  pageNumber,
  setPageNumber,
  hasNextPage = true,
}: PaginationProps) => {
  return (
    <div className="flex gap-3 items-center">
      {pageNumber !== 1 ? (
        <Button
          onClick={() => setPageNumber(pageNumber - 1)}
          className="p-1 md:p-2 text-[#ededed] hover:bg-[#111] rounded-full transition"
          aria-label="previous page"
        >
          <AiOutlineArrowLeft className="h-6 w-6" />
        </Button>
      ) : null}
      {hasNextPage ? (
        <Button
          onClick={() => setPageNumber(pageNumber + 1)}
          className="p-1 md:p-2 text-[#ededed] hover:bg-[#111] rounded-full transition"
          aria-label="next page"
        >
          <AiOutlineArrowRight className="h-6 w-6" />
        </Button>
      ) : null}
    </div>
  );
};

export default Pagination;
