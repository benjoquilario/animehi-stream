import React from 'react';
import Button from './button';
import classNames from 'classnames';
import { useDispatch } from '@/store/store';
import { toggleDub } from '@/store/watch/slice';

const DubButton = ({ dub }: { dub: boolean }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => dispatch(toggleDub(false))}
        type="button"
        className={classNames(
          'text-white text-sm py-2 px-3',
          dub ? '' : 'bg-primary'
        )}
      >
        Sub
      </Button>
      <Button
        onClick={() => dispatch(toggleDub(true))}
        type="button"
        className={classNames(
          'text-white text-sm py-2 px-3',
          dub ? 'bg-primary' : ''
        )}
      >
        Dub
      </Button>
    </div>
  );
};

export default DubButton;
