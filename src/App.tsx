import reactLogo from "./assets/react.svg";
import "./App.css";

import { useDispatch } from "react-redux";
import { incrementAsync } from "./redux";
import CounterButton from "./components/reusable/CounterButton";
import HighScoresGetQuery from "./components/HighScoresGetQuery";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      cacheTime: 5000,
      staleTime: 2500,
    },
  },
});

function App() {
  const dispatch = useDispatch();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <div>
          <a href="https://reactjs.org" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
        </div>
        <h1>React + Vite</h1>
        <h2>On CodeSandbox!</h2>
        <div className="card">
          <CounterButton onClick={() => dispatch(incrementAsync(1, 500))} />
        </div>
        <div className="card">
          <HighScoresGetQuery />
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </QueryClientProvider>
  );
}

export default App;
