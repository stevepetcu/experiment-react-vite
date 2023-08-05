import {useSelector} from 'react-redux';
import {leftCountSelect, rightCountSelect} from '../../redux';
import React, {forwardRef, useContext, useEffect} from 'react';
import {LoadLogContext} from '../../App';

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

  // @ts-ignore
  const {setLoadLog} = useContext(LoadLogContext);

  useEffect(() => {
    // @ts-ignore
    setLoadLog((loadLog) => [...loadLog, `${side} CounterButton loaded!`]);
  }, [setLoadLog])

  return <button data-testid="counter-button"
                 ref={ref}
                 onClick={onClick}>&ldquo;{key}&rdquo; team score: {count}</button>;
});
