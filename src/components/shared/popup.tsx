// credits to https://github.com/hoangvu12/Kaguya/blob/main/src/components/shared/Popup.tsx
// Takes me days to understand how react-popper and how it works https://popper.js.org/
import Portal from '@/components/shared/portal';
import useDevice from '@/hooks/useDevice';
import { Modifier, Options, Placement } from '@popperjs/core';
import classNames from 'classnames';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { usePopper } from 'react-popper';
import React, { useCallback, useMemo, useState } from 'react';

export interface PopupProps {
  children: React.ReactNode;
  reference?: React.ReactNode;
  options?: Partial<Options>;
  type?: 'hover' | 'click';
  placement?: Placement;
  showArrow?: boolean;
  offset?: number[];
  className?: string;
  portalSelector?: string;
  referenceClassName?: string;
  disabled?: boolean;
  popperComponent?: string | React.ComponentType<any>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const variants: Variants = {
  initial: {
    opacity: 0,
  },

  animate: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};

const emptyFn = () => {};

const Popup: React.FC<PopupProps> = props => {
  const {
    children,
    options: { modifiers = [], ...options } = {},
    reference,
    type = 'hover',
    placement = 'right-start',
    showArrow,
    offset = [10, 13],
    className,
    referenceClassName,
    portalSelector,
    disabled,
    popperComponent: PopperComponent = motion.div,
    onClick = emptyFn,
    onMouseEnter = emptyFn,
    onMouseLeave = emptyFn,
  } = props;

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const [active, setActive] = useState(false);
  const { isMobile } = useDevice();

  const arrowModifier = useMemo(
    () =>
      showArrow
        ? [
            {
              name: 'arrow',
              options: {
                element: arrowElement,
              },
            },
          ]
        : [],
    [showArrow, arrowElement]
  );

  const popperOptions = useMemo(
    () => ({
      modifiers: [
        ...modifiers,
        ...arrowModifier,
        {
          name: 'offset',
          options: {
            offset,
          },
        },
        {
          name: 'preventOverflow',
          options: {
            altAxis: true,
            padding: 10,
          },
        },
      ],
      placement,
      ...options,
    }),
    [arrowModifier, modifiers, offset, options, placement]
  );

  const { styles, attributes } = usePopper(
    referenceElement,
    popperElement,
    popperOptions
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onMouseEnter?.(e);

      if (disabled || isMobile) return;

      setActive(true);
    },
    [disabled, isMobile, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onMouseLeave?.(e);

      setActive(false);
    },
    [onMouseLeave]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      onClick?.(e);

      if (disabled) return;

      setActive(prev => !prev);
    },
    [onClick, disabled]
  );

  const handleDisable = useCallback(() => {
    setActive(false);
  }, []);

  const isHover = useMemo(() => type === 'hover', [type]);

  return (
    <React.Fragment>
      <div
        onClick={!isHover ? handleToggle : emptyFn}
        onMouseEnter={isHover ? handleMouseEnter : emptyFn}
        onMouseMove={isHover ? handleMouseEnter : emptyFn}
        onMouseLeave={isHover ? handleMouseLeave : emptyFn}
        ref={setReferenceElement}
        className={classNames(
          'cursor-pointer',
          referenceClassName,
          active && 'relative z-10'
        )}
      >
        {reference}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <Portal selector={portalSelector}>
            {!isHover && (
              <div className="fixed inset-0 z-40" onClick={handleDisable}></div>
            )}

            <PopperComponent
              variants={variants}
              animate="animate"
              exit="exit"
              initial="initial"
              transition={[0.83, 0, 0.17, 1]}
              ref={setPopperElement}
              style={styles.popper}
              className={classNames(
                'popup z-50 relative bg-white rounded-md drop-shadow-lg',
                className
              )}
              {...attributes.popper}
            >
              {children}

              {showArrow && (
                <div
                  className="popup__arrow"
                  ref={setArrowElement}
                  style={styles.arrow}
                />
              )}
            </PopperComponent>
          </Portal>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default React.memo(Popup);
