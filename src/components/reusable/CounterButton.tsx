import {useSelector} from 'react-redux';
import {leftCountSelect, rightCountSelect} from '../../redux';
import React, {forwardRef} from 'react';

interface ButtonProps {
  onClick: () => void;
  side: 'left' | 'right';
}

export default forwardRef(function CounterButton({
                                                   onClick,
                                                   side
                                                 }: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
  const count = side === 'left' ?
    useSelector(leftCountSelect) :
    useSelector(rightCountSelect);

  const key = side === 'left' ? 'a' : 'd';

  return <button data-testid="counter-button"
                 ref={ref}
                 onClick={onClick}>&ldquo;{key}&rdquo; team score: {count}</button>;
});
