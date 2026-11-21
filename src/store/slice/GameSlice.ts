import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Game } from "../../types/Game";

interface GameState {
    list: Game[];
    loading: boolean;
}

const initialState: GameState = {
    list: [],
    loading: false,
};

const gameSlice = createSlice({
    name: "games",
    initialState,

    reducers: {
        setGames: (state, action: PayloadAction<Game[]>) => {
            state.list = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setGames, setLoading } = gameSlice.actions;
export default gameSlice.reducer;
