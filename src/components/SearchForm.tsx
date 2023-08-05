import {ChangeEvent, useContext, useEffect, useRef, useState} from 'react';
import {LoadLogContext} from '../App';

interface Props {
  debounceTimeMs: number,
  throttleTimeMs: number,
}

export default function SearchForm({debounceTimeMs, throttleTimeMs}: Props) {
  const debouncedSearchResults = useRef<HTMLParagraphElement | null>(null);
  const throttledSearchResults = useRef<HTMLParagraphElement | null>(null);

  const debounceTimeout = useRef<string | number | NodeJS.Timeout | undefined>(undefined);
  const isThrottled = useRef<boolean>(false);

  const [searchString, setSearchString] = useState('');

  // @ts-ignore
  const {setLoadLog} = useContext(LoadLogContext);

  useEffect(() => {
    // @ts-ignore
    setLoadLog((loadLog) => [...loadLog, 'SearchForm loaded!'])
  }, [setLoadLog])

  function throttle(callback: () => void, ms: number) {
    if (isThrottled.current) {
      return;
    }

    isThrottled.current = true;

    setTimeout(() => {
      callback();
      isThrottled.current = false;
    }, ms);
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (debouncedSearchResults.current) {
        debouncedSearchResults.current.textContent = event.target.value;
      }
    }, debounceTimeMs);

    throttle(() => {
      if (throttledSearchResults.current) {
        throttledSearchResults.current.textContent = event.target.value;
      }
    }, throttleTimeMs);
  }

  return (
    <>
      <input type="text" onInput={handleSearch} value={searchString} aria-label={'Search input field'}/>
      <p>Live update: <span data-testid="live-update-text">{searchString}</span></p>
      <p>Debounced value: <span data-testid="debounced-update-text" ref={debouncedSearchResults}></span></p>
      <p>Throttled value: <span data-testid="throttled-update-text" ref={throttledSearchResults}></span></p>
    </>
  );
}
