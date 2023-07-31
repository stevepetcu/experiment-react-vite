import {configureStore, createSlice} from '@reduxjs/toolkit';

export default function getTestStore(initialStateValue: number) {
  const TestCounterSlice = createSlice({
    name: "test-counter-slice", // Still don't know wtf this does.
    initialState: {
      value: initialStateValue, // "value" can be anything, we use it in state.{foo}.{bar}, bar === value here.
    },
    reducers: {}
  });


// @ts-ignore
  const testCountSelect = (state) => state.counter.value;

 const store = configureStore({
    reducer: {
      // This is what we use for our selector when we do
      // state.counter
      counter: TestCounterSlice.reducer,
    }
  });

 return { testCountSelect, store };
}
