import { configureStore } from "@reduxjs/toolkit";
import membersReducer from "./features/membersSlice"
import cardsReducer from "./features/cardsSlice"
import paymentsReducer from "./features/paymentsSlice"

export const store = configureStore({
  reducer: { 
    members: membersReducer,
    cards: cardsReducer,
    payments: paymentsReducer
  },
});