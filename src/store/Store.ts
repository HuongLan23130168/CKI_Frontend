import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./slice/GameSlice";

export const store = configureStore({
    reducer: {
        games: gameReducer,
    },
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
