import { createSlice } from "@reduxjs/toolkit";
import delay from "../utils/delay";

const CounterSlice = createSlice({
    name: "counter-slice", // Still don't know wtf this does.
    initialState: {
        leftValue: 0, // "value" can be anything, we use it in state.{foo}.{bar}, bar === value here.
        rightValue: 0
    },
    reducers: {
        incrementByAmount: (state, action) => {
            if (action.payload.side === 'left') {
                state.leftValue += action.payload.amount;
            } else {
                state.rightValue += action.payload.amount
            }
        },
        decrementByAmount: (state, action) => {
            if (action.payload.side === 'left') {
                state.leftValue -= action.payload.amount;
            } else {
                state.rightValue -= action.payload.amount
            }
        }
    }
});

// @ts-ignore
export const incrementAsync = (amount: number, side: 'left' | 'right', waitTime: number) => async (dispatch) => {
    await delay(waitTime);
    dispatch(CounterSlice.actions.incrementByAmount({amount, side}));
}

// @ts-ignore
export const decrementAsync = (amount: number, side: 'left' | 'right', waitTime: number) => async (dispatch) => {
    await delay(waitTime);
    dispatch(CounterSlice.actions.decrementByAmount({amount, side}));
}

// @ts-ignore
export const leftCountSelect = (state) => state.counter.leftValue;
// @ts-ignore

export const rightCountSelect = (state) => state.counter.rightValue;

export default CounterSlice.reducer;
