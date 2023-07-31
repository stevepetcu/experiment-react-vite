import { createSlice } from "@reduxjs/toolkit";
import delay from "../utils/delay";

const CounterSlice = createSlice({
    name: "counter-slice", // Still don't know wtf this does.
    initialState: {
        value: 0, // "value" can be anything, we use it in state.{foo}.{bar}, bar === value here.
    },
    reducers: {
        incrementByAmount: (state, action) => {
            state.value += action.payload;
        },
        decrementByAmount: (state, action) => {
            state.value += action.payload;
        }
    }
});

export const incrementAsync = (amount: number, waitTime: number) => async (dispatch) => {
    await delay(waitTime);
    dispatch(CounterSlice.actions.incrementByAmount(amount || 0));
}

export const countSelect = (state) => state.counter.value;

export default CounterSlice.reducer;
