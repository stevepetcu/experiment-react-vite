import reactLogo from './assets/react.svg';
import './App.css';

import {useDispatch} from 'react-redux';
import {incrementAsync} from './redux';
import CounterButton from './components/reusable/CounterButton';
import HighScoresGetQuery from './components/HighScoresGetQuery';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import SearchForm from './components/SearchForm';
import {decrementAsync} from './redux/counter-slice';
import {useEffect, useRef} from 'react';

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

function App() {
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

  return (
    <QueryClientProvider client={queryClient}>
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
        <div className="card">
          <CounterButton ref={leftButton}
                         side={'left'}
                         onClick={() => {
                           dispatch(incrementAsync(1, 'left', 250));
                           dispatch(decrementAsync(1, 'right', 250));
                         }}/>
          &emsp;
          <CounterButton ref={rightButton}
                         side={'right'}
                         onClick={() => {
                           dispatch(incrementAsync(1, 'right', 250));
                           dispatch(decrementAsync(1, 'left', 250));
                         }}/>
        </div>
        <div>
          <SearchForm debounceTimeMs={1500} throttleTimeMs={750}/>
        </div>
        <div className="card">
          <HighScoresGetQuery refetchIntervalMs={5000}/>
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </QueryClientProvider>
  );
}

export default App;
