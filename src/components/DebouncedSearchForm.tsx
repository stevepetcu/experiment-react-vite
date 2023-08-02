import {ChangeEvent, useRef, useState} from 'react';

interface Props {
  debounceTimeMs: number,
}

export default function DebouncedSearchForm({debounceTimeMs}: Props) {
  const soCalledSearchResultsRef = useRef<HTMLParagraphElement | null>(null);
  const debounceTimeout = useRef<string | number | NodeJS.Timeout | undefined>(undefined);

  const [searchString, setSearchString] = useState('');

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (soCalledSearchResultsRef.current) {
        soCalledSearchResultsRef.current.textContent = event.target.value;
      }
    }, debounceTimeMs);
  }

  return (
    <>
      <input type="text" onInput={handleSearch} value={searchString} aria-label={'Search input field'} />
      <p>Live update: <span data-testid='live-update-text'>{searchString}</span></p>
      <p>Debounced value: <span data-testid='debounced-update-text' ref={soCalledSearchResultsRef}></span></p>
    </>
  );
}
