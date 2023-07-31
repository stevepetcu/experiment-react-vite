import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counter-slice";

export default configureStore({
    reducer: {
        // This is what we use for our selector when we do
        // state.counter
        counter: counterReducer,
    }
});
