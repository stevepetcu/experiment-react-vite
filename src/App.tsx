import reactLogo from './assets/react.svg';
import './App.css';

import {useDispatch} from 'react-redux';
import {incrementAsync} from './redux';
import CounterButton from './components/reusable/CounterButton';
import HighScoresGetQuery from './components/HighScoresGetQuery';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import SearchForm from './components/SearchForm';
import {decrementAsync} from './redux/counter-slice';
import React, {createContext, useEffect, useRef, useState} from 'react';
import TicTacToe from './components/TicTacToe';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      cacheTime: 5000,
      staleTime: 2500,
    },
  },
});

// Some really silly usage of React context (check my comment on the loadLog list below)
// TODO: FIX ALL THE TS ERRORS! 🤮
export const LoadLogContext = createContext<React.Dispatch<React.SetStateAction<string[]>>>(() => []);

function App() {
  const [loadLog, setLoadLog] = useState<string[]>([]);

  const leftButton = useRef<HTMLButtonElement>(null);
  const rightButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function keyEvListener(ev: KeyboardEvent) {
      if (ev.key === 'a' && leftButton.current) {
        ev.preventDefault();
        ev.stopPropagation();
        leftButton.current.click();
      } else if (ev.key === 'd' && rightButton.current) {
        ev.preventDefault();
        ev.stopPropagation();
        rightButton.current.click();
      }
    }

    window.addEventListener('keypress', keyEvListener);

    return () => {
      window.removeEventListener('keypress', keyEvListener);
    };
  }, []);

  const dispatch = useDispatch();

  // @ts-ignore
  return (<QueryClientProvider client={queryClient}><LoadLogContext.Provider value={{setLoadLog}}>
        <div className="App">
          <div>
            <a href="https://reactjs.org" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo"/>
            </a>
            <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
              <img src="/vite.svg" className="logo" alt="Vite logo"/>
            </a>
          </div>
          <h1>React + Vite</h1>
          <h2>On CodeSandbox!</h2>
          <p>Components load log</p>
          <ul>
            {
              // In dev, the initial renders are duplicated, due to the <React.StrictMode> thing in main.tsx
              // See https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
              loadLog.map((ll, index) => (
                <li key={index}>{ll}</li>
              ))
            }
          </ul>
          <div className="card">
            <CounterButton ref={leftButton}
                           side={'left'}
                           onClick={() => {
                             // @ts-ignore
                             dispatch(incrementAsync(1, 'left', 250));
                             // @ts-ignore
                             dispatch(decrementAsync(1, 'right', 250));
                           }}/>
            &emsp;
            <CounterButton ref={rightButton}
                           side={'right'}
                           onClick={() => {
                             // @ts-ignore
                             dispatch(incrementAsync(1, 'right', 250));
                             // @ts-ignore
                             dispatch(decrementAsync(1, 'left', 250));
                           }}/>
          </div>
          <div>
            <SearchForm debounceTimeMs={1500} throttleTimeMs={750}/>
          </div>
          <div className="card">
            <HighScoresGetQuery refetchIntervalMs={5000}/>
          </div>
          <div className="card">
            <TicTacToe />
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </LoadLogContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
