import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem("cards"));

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: (state, action) => {
      state.push(action.payload);
    },
    editCard: (state, action) => {
      const { id_tarjeta } = action.payload;
      const foundCard = state.find((card) => card.id_tarjeta === id_tarjeta);
      if (foundCard) {
        Object.assign(foundCard, action.payload);
      }
    }
  },
});

export const { addCard, editCard, deactivateCard } = cardsSlice.actions;
export default cardsSlice.reducer;