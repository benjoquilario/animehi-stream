import { Disclosure as HeadlessDisclosure } from '@headlessui/react';
import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

type DisclosureProps = {
  button: JSX.Element;
  className?: string;
  panelClassName?: string;
  buttonClassName?: string;
  defaultOpen?: boolean;
};

const Disclosure = (props: PropsWithChildren<DisclosureProps>): JSX.Element => {
  return (
    <HeadlessDisclosure
      defaultOpen={props.defaultOpen}
      as="div"
      className={classNames(props.className)}
    >
      {({ open }) => (
        <>
          <HeadlessDisclosure.Button
            className={classNames('mt-1 px-3 block', props.buttonClassName)}
          >
            {props.button}
          </HeadlessDisclosure.Button>

          <HeadlessDisclosure.Panel
            className={classNames(props.panelClassName, !open && 'hidden')}
            static
          >
            {props.children}
          </HeadlessDisclosure.Panel>
        </>
      )}
    </HeadlessDisclosure>
  );
};

export default React.memo(Disclosure);
